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

export const checkExistingFacultyRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username } = req.params;

  try {
    const existingRequest = await ApprovalRequest.findOne({
      username,
      role: "faculty",
    });

    if (existingRequest) {
      // If request is approved, check if the user still exists
      if (existingRequest.status === "approved") {
        const existingUser = await User.findOne({ username, role: "faculty" });
        if (!existingUser) {
          // User was deleted, allow new registration
          res.status(200).json({
            hasRequest: false,
            message: "No existing faculty request found",
          });
        }
      }

      res.status(200).json({
        hasRequest: true,
        status: existingRequest.status,
        message: `You have already sent a faculty registration request. Status: ${existingRequest.status}`,
      });
    }

    res.status(200).json({
      hasRequest: false,
      message: "No existing faculty request found",
    });
  } catch (error) {
    next(error);
  }
};

export const getAllFacultyRequests = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { status } = req.query;

  try {
    let query: any = { role: "faculty" };

    if (status && status !== "all") {
      query = { ...query, status: status as string };
    }

    const requests = await ApprovalRequest.find(query).sort({ createdAt: -1 });
    res.status(200).json(requests);
  } catch (error) {
    next(error);
  }
};

export const deleteRejectedRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { requestId } = req.params;

  try {
    const request = await ApprovalRequest.findById(requestId);

    if (!request) {
      throw createHttpError(404, "Request not found");
    }

    if (request.status !== "rejected" && request.status !== "approved") {
      throw createHttpError(
        400,
        "Only rejected or approved requests can be deleted"
      );
    }

    await ApprovalRequest.findByIdAndDelete(requestId);

    res.status(200).json({
      message: `${request.status} request deleted successfully`,
    });
  } catch (error) {
    next(error);
  }
};
