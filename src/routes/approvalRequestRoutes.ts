import express from "express";
import {
  approveFacultyRequest,
  getPendingFacultyRequests,
} from "../controllers/ApprovalRequestControllers";
const router = express.Router();

router.patch("", approveFacultyRequest);

router.get("", getPendingFacultyRequests);

export default router;
