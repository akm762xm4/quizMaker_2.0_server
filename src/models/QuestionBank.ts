import mongoose, { Schema, Document } from "mongoose";

export interface IQuestionBank extends Document {
  title: string;
  createdBy: mongoose.Types.ObjectId;
  questions: mongoose.Types.ObjectId[];
}

const QuestionBankSchema = new Schema<IQuestionBank>({
  title: { type: String, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  questions: [{ type: Schema.Types.ObjectId, ref: "Question" }],
});

export default mongoose.model<IQuestionBank>(
  "QuestionBank",
  QuestionBankSchema
);
