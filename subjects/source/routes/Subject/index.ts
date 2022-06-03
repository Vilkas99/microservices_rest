import { getSubjectCareerController } from "../../controllers/Subject/Get";
import { getAllSubjectsController } from "../../controllers/Subject/Get";

const express = require("express");
const router = express.Router();

router.get("/career", getSubjectCareerController);
router.get("/", getAllSubjectsController);
// router.post("/", createSchedule);
// router.patch("/", updateSchedule);

module.exports = router;
