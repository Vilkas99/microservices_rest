import { getSubjectCareerSemesterController } from "../../controllers/Subject/Get";
import { getAllSubjectsController } from "../../controllers/Subject/Get";
import { getSubjectCareerController } from "../../controllers/Subject/Get";
import { createSubjectController } from "../../controllers/Subject/Create";
import { updateSubjectController } from "../../controllers/Subject/Update";
import { deleteSubjectController } from "../../controllers/Subject/Delete";

const express = require("express");
const router = express.Router();

router.get("/career", getSubjectCareerSemesterController);
router.get("/all", getAllSubjectsController);
router.get("/", getSubjectCareerController);
router.post("/", createSubjectController);
router.patch("/", updateSubjectController);
router.delete("/", deleteSubjectController);

module.exports = router;
