import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";

type Role = "admin" | "faculty" | "student";

/**
 * Authorizes a request after `requiresAuth` has attached the signed-in user.
 * Keeping this on the server is important: hiding a client navigation item is
 * not a security boundary.
 */
export const requireRole = (...roles: Role[]) =>
  (req: Request, _res: Response, next: NextFunction) => {
    const role = req.user?.role as Role | undefined;

    if (!role || !roles.includes(role)) {
      return next(createHttpError(403, "You do not have permission to do that."));
    }

    next();
  };
