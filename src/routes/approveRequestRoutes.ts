import express from "express";
import {
  approveFacultyRequest,
  getAllFacultyRequests,
  getPendingFacultyRequests,
  checkExistingFacultyRequest,
  deleteRejectedRequest,
} from "../controllers/approveRequestControllers";
import { requireRole } from "../middlewares/requireRole";

const router = express.Router();

// This powers the public faculty-registration form and deliberately exposes
// only whether that username has a request, not the request list itself.
router.get("/check/:username", checkExistingFacultyRequest);

router.use(requireRole("admin"));

router.patch("", approveFacultyRequest);

router.get("", getAllFacultyRequests);

router.get("/pending", getPendingFacultyRequests);

router.delete("/:requestId", deleteRejectedRequest);

export default router;
