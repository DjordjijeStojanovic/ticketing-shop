import { OrderStatus } from "@djordjestojanovic/common";
import mongoose from "mongoose";
import { Order } from "./order";

interface TicketAttributes {
    id: string;
    title: string;
    price: number;
}

export interface TicketDocument extends mongoose.Document {
    title: string;
    price: number;
    isReserved(): Promise<boolean>;
    version: number;
}

interface TicketModel extends mongoose.Model<TicketDocument> {
    build(attributes: TicketAttributes): TicketDocument;
    findByIdAndPreviousVersion(event: { id: string, version: number }): Promise<TicketDocument | null>;
}

const ticketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    }, price: {
        type: Number,
        required: true,
        min: 0
    }
}, {
    toJSON: {
        transform(doc, ret: any) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

ticketSchema.set('versionKey', 'version');
ticketSchema.pre('save', function() {
    if(!this.isNew) {
        const current = this.get('version') as number;
        this.set('version', current+1);
        (this as any).$where = {
            version: current
        };
    }
});

ticketSchema.statics.findByIdAndPreviousVersion = (event: { id: string, version: number }) => {
    return Ticket.findOne({
        _id: event.id,
        version: event.version - 1
    });
};

ticketSchema.statics.build = (attributes: TicketAttributes) => {
    return new Ticket({
        _id: attributes.id,
        title: attributes.title,
        price: attributes.price
    });
};

ticketSchema.methods.isReserved = async function() {
    const ticketReserved = await Order.findOne({
        ticket: this,
        status: {
            $in: [
                OrderStatus.AwaitingPayment,
                OrderStatus.Created,
                OrderStatus.Completed
            ]
        }
    })

    return !!ticketReserved;
};

const Ticket = mongoose.model<TicketDocument, TicketModel>('Ticket', ticketSchema);

export { Ticket };