import express from "express";
import {
  approveFacultyRequest,
  getAllFacultyRequests,
  getPendingFacultyRequests,
  checkExistingFacultyRequest,
  deleteRejectedRequest,
} from "../controllers/approveRequestControllers";

const router = express.Router();

router.patch("", approveFacultyRequest);

router.get("", getAllFacultyRequests);

router.get("/pending", getPendingFacultyRequests);

router.get("/check/:username", checkExistingFacultyRequest);

router.delete("/:requestId", deleteRejectedRequest);

export default router;
