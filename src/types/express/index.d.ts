import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: string;
        id: string;
        class?: string;
        role?: string;
      };
    }
  }
}
