import mongoose from "mongoose";
import { OrderStatus } from "@djordjestojanovic/common";
import { TicketDocument } from "./ticket";

interface OrderAtrributes {
    userId: string;
    status: OrderStatus;
    expiresAt: Date;
    ticket: TicketDocument;

}

interface OrderDocument extends mongoose.Document {
    userId: string;
    status: OrderStatus;
    expiresAt: Date;
    ticket: TicketDocument;
    version: number;
}

interface OrderModel extends mongoose.Model<OrderDocument> {
    build(attributes: OrderAtrributes): OrderDocument;
}

const orderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    }, status: {
        type: String,
        enum: Object.values(OrderStatus),
        default: OrderStatus.Created,
        required: true
    }, expiresAt: {
        type: mongoose.Schema.Types.Date,
        required: true
    }, ticket: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ticket',
        required: true
    }
}, {
    toJSON: {
        transform(doc, ret: any) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

orderSchema.set('versionKey', 'version');
orderSchema.pre('save', function() {
    if(!this.isNew) {
        const current = this.get('version') as number;
        this.set('version', current+1);
        (this as any).$where = {
            version: current
        };
    }
});

orderSchema.statics.build = (attributes: OrderAtrributes) => {
    return new Order(attributes);
}

const Order = mongoose.model<OrderDocument, OrderModel>('Order', orderSchema);

export { Order };