import mongoose, { Schema, Document } from 'mongoose';

interface IQuiz extends Document {
  title: string;
  questions: mongoose.Types.ObjectId[];
  maxTime: number;
  enabled: boolean;
  subject: string;
  class: string;
  createdBy: mongoose.Types.ObjectId;
}

const QuizSchema: Schema = new Schema({
  title: { type: String, required: true },
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
  maxTime: { type: Number, required: true },
  enabled: { type: Boolean, default: true },
  subject: { type: String, required: true },
  class: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

export default mongoose.model<IQuiz>('Quiz', QuizSchema);
