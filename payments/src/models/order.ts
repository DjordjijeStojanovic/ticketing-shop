import { OrderStatus } from "@djordjestojanovic/common";
import mongoose, { version } from "mongoose";

interface OrderAtrributes {
   id: string;
   version: number;
   status: OrderStatus;
   userId: string;
   price: number;
}

interface OrderDocument extends mongoose.Document {
    version: number;
    status: OrderStatus;
    userId: string;
    price: number;
}

interface OrderModel extends mongoose.Model<OrderDocument> {
    build(attributes: OrderAtrributes): OrderDocument;
}

const orderSchema = new mongoose.Schema({
    status: {
        type: String,
        default: OrderStatus.Created,
        enum: Object.values(OrderStatus)
    }, userId: {
        type: String,
        required: true
    }, price: {
        type: Number,
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
    return new Order({
        _id: attributes.id,
        version: attributes.version,
        status: attributes.status,
        userId: attributes.userId,
        price: attributes.price
    });
}

const Order = mongoose.model<OrderDocument, OrderModel>('Order', orderSchema);

export { Order };
