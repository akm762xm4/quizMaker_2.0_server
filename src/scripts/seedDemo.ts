import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import env from "../utils/validateEnv";
import User from "../models/User";
import Question from "../models/Question";
import QuestionBank from "../models/QuestionBank";
import Quiz from "../models/Quiz";
import Result from "../models/Result";

// DEMO_PASSWORD is the documented name. DEMO_PASS is accepted as a
// compatibility alias so existing local environments continue to work.
const password =
  process.env.DEMO_PASSWORD || process.env.DEMO_PASS || "DemoPass123!";

const upsertDemoUser = async (
  username: string,
  role: "admin" | "faculty" | "student"
) => {
  const hashedPassword = await bcrypt.hash(password, 12);
  return User.findOneAndUpdate(
    { username },
    { username, role, password: hashedPassword, isActive: true },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
};

const seed = async () => {
  await mongoose.connect(env.MONGO_URI);

  const [admin, faculty, student] = await Promise.all([
    upsertDemoUser("demo-admin", "admin"),
    upsertDemoUser("demo-faculty", "faculty"),
    upsertDemoUser("demo-student", "student"),
  ]);

  // Remove only data owned by the demo faculty so reseeding is safe for a
  // production database that also contains real users.
  const existingBanks = await QuestionBank.find({ createdBy: faculty._id });
  const questionIds = existingBanks.flatMap((bank) => bank.questions);
  const existingQuizzes = await Quiz.find({ createdBy: faculty._id });

  await Promise.all([
    QuestionBank.deleteMany({ createdBy: faculty._id }),
    Quiz.deleteMany({ createdBy: faculty._id }),
    Result.deleteMany({
      $or: [
        { studentId: student._id },
        { quizId: { $in: existingQuizzes.map((quiz) => quiz._id) } },
      ],
    }),
    Question.deleteMany({ _id: { $in: questionIds } }),
  ]);

  const questions = await Question.insertMany([
    {
      text: "Which HTTP status code represents a successful request?",
      options: ["201", "200", "400", "404"],
      correctOption: 1,
      category: "Web fundamentals",
    },
    {
      text: "Which React hook is designed for local component state?",
      options: ["useEffect", "useState", "useMemo", "useRef"],
      correctOption: 1,
      category: "React",
    },
    {
      text: "What does JWT commonly stand for?",
      options: ["Java Web Token", "JSON Web Token", "Joined Web Ticket", "JSON Write Token"],
      correctOption: 1,
      category: "Authentication",
    },
  ]);

  const bank = await QuestionBank.create({
    title: "Full-stack foundations",
    createdBy: faculty._id,
    questions: questions.map((question) => question._id),
  });

  const quiz = await Quiz.create({
    title: "Full-stack foundations — demo quiz",
    questions: bank.questions,
    maxTime: 10,
    enabled: true,
    createdBy: faculty._id,
  });

  await Result.create({
    studentId: student._id,
    quizId: quiz._id,
    score: 2,
    totalMarks: questions.length,
  });

  console.log("Demo workspace is ready.");
  console.log(`Admin: ${admin.username}`);
  console.log(`Faculty: ${faculty.username}`);
  console.log(`Student: ${student.username}`);
};

seed()
  .catch((error) => {
    console.error("Unable to seed demo data:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
