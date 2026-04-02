import mongoose from 'mongoose';
import { Password } from '../utils/password'

//This interface prevents random attributes being sent to Mongoose when creating a user
interface UserAttributes {
    email: string;
    password: string;
}

interface UserModel extends mongoose.Model<UserDocument> {
    build(attributes: UserAttributes): UserDocument;
}

interface UserDocument extends mongoose.Document {
    email: string;
    password: string;
}

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

userSchema.pre('save', async function (done) {
    if(this.isModified('password')) {
        const hashed = await Password.hashPass(this.get('password'));
        this.set('password', hashed);
    }
})

userSchema.statics.build = (attributes: UserAttributes) => {
    return new User(attributes);
}

const User = mongoose.model<UserDocument, UserModel>('User', userSchema);

export { User };