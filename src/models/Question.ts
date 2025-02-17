import mongoose, { Schema, Document } from "mongoose";

interface IQuestion extends Document {
  text: string;
  options: string[];
  correctOption: number;
  category: string;
  // marks: number;
}

const QuestionSchema: Schema = new Schema(
  {
    text: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctOption: { type: Number, required: true },
    category: { type: String, required: true },
    // marks: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IQuestion>("Question", QuestionSchema);
