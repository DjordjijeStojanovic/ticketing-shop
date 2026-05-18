import { OrderStatus } from "@djordjestojanovic/common";
import mongoose from "mongoose";
import { Order } from "./order";

interface TicketAttributes {
    title: string;
    price: number;
}

export interface TicketDocument extends mongoose.Document {
    title: string;
    price: number;
    isReserved(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDocument> {
    build(attributes: TicketAttributes): TicketDocument;
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

ticketSchema.statics.build = (attributes: TicketAttributes) => {
    return new Ticket(attributes);
}

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