import mongoose, { Document, Schema } from 'mongoose';

type UserRole = 'user' | 'admin';

export interface IUser extends Document {
    _id: string;
    uid: string;
    email: string;
    name: string;
    photoURL?: string;
    provider: string;
    role: UserRole;
    gender: string;
    dob: Date;
}

const UserSchema: Schema = new Schema({
    uid: {
        type: String,
        required: [true, 'Please enter user ID'],
        unique: true
    },
    email: {
        type: String,
        required: [true, 'Please enter email'],
        unique: true
    },
    name: {
        type: String,
        required: [true, 'Please enter display name']
    },
    photoURL: {
        type: String,
        default: 'https://static.vecteezy.com/system/resources/thumbnails/005/129/844/small_2x/profile-user-icon-isolated-on-white-background-eps10-free-vector.jpg'
    },
    provider: {
        type: String,
        required: [true, 'Please enter provider']
    },
    role: {
        type: String,
        required: [true, 'Please enter role'],
        default: 'user'
    },
    gender: {
        type: String,
        required: [true, 'Please enter gender']
    },
    dob: {
        type: Date,
        required: [true, 'Please enter date of birth']
    }
});

export default mongoose.model<IUser>('User', UserSchema);
