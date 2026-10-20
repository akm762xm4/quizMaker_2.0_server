import express, { NextFunction, Request, Response } from "express";
import authRoutes from "./routes/authRoutes";
import approveFacultyRoutes from "./routes/approveRequestRoutes";
import userRoutes from "./routes/userRoutes";
import quizRoutes from "./routes/quizRoutes";
import questionBankRoutes from "./routes/questionBankRoutes";
import studentRoutes from "./routes/studentRoutes";
import { requiresAuth } from "./middlewares/requiresAuth";
import morgan from "morgan";
import cors from "cors";
import createHttpError, { isHttpError } from "http-errors";

const allowedOrigins = new Set(
  (process.env.CLIENT_URL || "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)
);

const corsOptions = {
  origin: (origin: string | undefined, callback: (error: Error | null, origin?: boolean) => void) => {
    if (
      !origin ||
      allowedOrigins.has(origin) ||
      /^https:\/\/quiz-maker-2-0-client-[a-z0-9-]+\.vercel\.app$/.test(origin)
    ) {
      callback(null, true);
      return;
    }

    callback(new Error("Origin is not allowed by CORS"));
  },
  credentials: true,
};

const app = express();

app.use(cors(corsOptions));

app.use(morgan("dev"));

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/approveFaculty", requiresAuth, approveFacultyRoutes);
app.use("/api/qbank", requiresAuth, questionBankRoutes);
app.use("/api/quiz", requiresAuth, quizRoutes);
app.use("/api/users", requiresAuth, userRoutes);
app.use("/api/student", requiresAuth, studentRoutes);

app.use((req, res, next) => {
  next(createHttpError(404, "Endpoint not Found !"));
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error(error);
  let errorMessage = "An unknown Error Occurred!";
  let statusCode = 500;
  if (isHttpError(error)) {
    statusCode = error.status;
    errorMessage = error.message;
  } else if (error instanceof Error) {
    // Keep unexpected failures diagnosable during local development instead
    // of hiding every document-import problem behind the same generic text.
    errorMessage = error.message || errorMessage;
  }
  res.status(statusCode).json({ error: errorMessage });
});

export default app;
