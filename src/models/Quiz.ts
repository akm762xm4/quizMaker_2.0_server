import mongoose, { Schema, Document } from "mongoose";

interface IQuiz extends Document {
  title: string;
  questions: mongoose.Types.ObjectId[];
  enabled: boolean;
  createdBy: mongoose.Types.ObjectId;
  maxTime: number;
}

const QuizSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    questions: [{ type: Schema.Types.ObjectId, ref: "Question" }],
    maxTime: { type: Number, required: true },
    enabled: { type: Boolean, default: false },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IQuiz>("Quiz", QuizSchema);
