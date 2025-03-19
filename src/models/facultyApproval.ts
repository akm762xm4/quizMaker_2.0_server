import mongoose, { Schema, Document } from "mongoose";

interface IFacultyApproval extends Document {
  username: string;
  password: string;
  role: string;
  requestedAt: Date;
}

const FacultyApprovalSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["faculty"], required: true },
  requestedAt: { type: Date, default: Date.now },
});

export default mongoose.model<IFacultyApproval>(
  "FacultyApproval",
  FacultyApprovalSchema
);
