import mongoose, { Schema, Document } from 'mongoose';

interface IResult extends Document {
  studentId: mongoose.Types.ObjectId;
  quizId: mongoose.Types.ObjectId;
  score: number;
  totalMarks: number;
  attemptedOn: Date;
}

const ResultSchema: Schema = new Schema({
  studentId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  quizId: { type: mongoose.Types.ObjectId, ref: 'Quiz', required: true },
  score: { type: Number, required: true },
  totalMarks: { type: Number, required: true },
  attemptedOn: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model<IResult>('Result', ResultSchema);
