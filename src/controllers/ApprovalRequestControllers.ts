import { NextFunction, Request, Response } from "express";
import ApprovalRequest from "../models/approvalRequest";
import User from "../models/User";
import createHttpError from "http-errors";

export const approveFacultyRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const { requestId, action } = req.body; // action can be 'approve' or 'reject'

  if (!requestId || !action) {
    throw createHttpError(400, "Request ID and action are required");
  }

  try {
    const request = await ApprovalRequest.findById(requestId);

    if (!request) {
      throw createHttpError(404, "Request not found");
    }

    if (action === "approve") {
      // Create the user in the User collection
      const user = new User({
        username: request.username,
        password: request.password,
        role: request.role,
      });

      await user.save();

      // Update the request status to 'approved'
      request.status = "approved";
      await request.save();

      return res.status(200).json({
        message: "Faculty registration approved and user created",
        user,
      });
    } else if (action === "reject") {
      // Update the request status to 'rejected'
      request.status = "rejected";
      await request.save();

      return res.status(200).json({
        message: "Faculty registration rejected",
        request,
      });
    } else {
      throw createHttpError(400, "Invalid action");
    }
  } catch (error) {
    next(error);
  }
};

export const getPendingFacultyRequests = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const pendingRequests = await ApprovalRequest.find({ status: "pending" });
    res.status(200).json(pendingRequests);
  } catch (error) {
    next(error);
  }
};
