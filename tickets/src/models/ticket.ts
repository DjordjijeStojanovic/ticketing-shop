import mongoose from "mongoose";

interface TicketAttributes {
    title: string;
    price: number;
    userId: string;
}

interface TicketModel extends mongoose.Model<TicketDocument> {
    build(attributes: TicketAttributes): TicketDocument;
}

interface TicketDocument extends mongoose.Document {
    id: string;
    title: string;
    price: number;
    userId: string;
    version: number;
    orderId?: string;
}

const ticketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    userId: {
        type: String,
        required: true
    }, 
    orderId: {
        type: String,
        required: false
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
ticketSchema.pre('save', function () {
    if(!this.isNew) {
        const current = this.get('version') as number;
        this.set('version', current+1);
        (this as any).$where = { 
            version: current
        };
    }
});
ticketSchema.statics.build = (attributes: TicketAttributes) => {
    return new Ticket(attributes);
};

const Ticket = mongoose.model<TicketDocument, TicketModel>('Ticket', ticketSchema);

export { Ticket };
