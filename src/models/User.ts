import mongoose, { Schema, Document } from 'mongoose';

interface IUser extends Document {
  username: string;
  password: string;
  role: 'admin' | 'faculty' | 'student';
  isActive: boolean;
  class?: string;
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'faculty', 'student'], required: true },
  isActive: { type: Boolean, default: true },
  class: { type: String },
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);
