import mongoose, { Schema, Document } from "mongoose";

export interface IApprovalRequest extends Document {
  username: string;
  password: string;
  role: string;
  status: string;
}

const ApprovalRequestSchema: Schema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true }, // Store the hashed password
  role: { type: String, required: true, default: "faculty" },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
});

export default mongoose.model<IApprovalRequest>(
  "ApprovalRequest",
  ApprovalRequestSchema
);
