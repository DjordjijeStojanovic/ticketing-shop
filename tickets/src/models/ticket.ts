import mongoose from "mongoose";

interface TicketAttributes {
    title: string;
    price: string;
    userId: string;
}

interface TicketModel extends mongoose.Model<TicketAttributes> {
    build(attributes: TicketAttributes): TicketDocument;
}

interface TicketDocument extends mongoose.Document {
    title: string;
    price: string;
    userId: string;
}

const ticketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    }
}, {
    toJSON: {
        transform(doc, ret: any) {
            ret.id = ret._id;
            delete ret._id;
        },
        versionKey: false
    }
});

ticketSchema.statics.build = (attributes: TicketAttributes) => {
    return new Ticket(attributes);
};

const Ticket = mongoose.model<TicketDocument, TicketModel>('Ticket', ticketSchema);

export { Ticket };
