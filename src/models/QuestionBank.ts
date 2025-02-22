import mongoose, { Schema, Document } from "mongoose";
import { IQuestion } from "./Question";

export interface IQuestionBank extends Document {
  title: string;
  createdBy: mongoose.Types.ObjectId;
  questions: IQuestion[];
}

const QuestionBankSchema = new Schema<IQuestionBank>({
  title: { type: String, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  questions: [
    {
      text: { type: String, required: true },
      options: { type: [String], required: true },
      correctOption: { type: String, required: true },
      category: { type: String, required: true },
    },
  ],
});

export default mongoose.model<IQuestionBank>(
  "QuestionBank",
  QuestionBankSchema
);
