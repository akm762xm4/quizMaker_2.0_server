import express from "express";
import {
  approveFacultyRequest,
  getPendingFacultyRequests,
  checkExistingFacultyRequest,
  getAllFacultyRequests,
  deleteRejectedRequest,
} from "../controllers/approvalRequestControllers";
const router = express.Router();

router.patch("", approveFacultyRequest);

router.get("", getAllFacultyRequests);

router.get("/pending", getPendingFacultyRequests);

router.get("/check/:username", checkExistingFacultyRequest);

router.delete("/:requestId", deleteRejectedRequest);

export default router;
