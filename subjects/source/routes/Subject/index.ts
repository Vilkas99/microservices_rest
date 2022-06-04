import { getSubjectCareerSemesterController } from "../../controllers/Subject/Get";
import { getAllSubjectsController } from "../../controllers/Subject/Get";
import { getSubjectCareerController } from "../../controllers/Subject/Get";

const express = require("express");
const router = express.Router();

router.get("/career", getSubjectCareerSemesterController);
router.get("/all", getAllSubjectsController);
router.get("/", getSubjectCareerController);
// router.post("/", createSchedule);
// router.patch("/", updateSchedule);

module.exports = router;
