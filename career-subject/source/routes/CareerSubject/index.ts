import { getSubjectCareerController } from "../../controllers/CareerSubject/Get";
import { createCareerSubjectController } from "../../controllers/CareerSubject/Create";
import { updateSubjectController } from "../../controllers/CareerSubject/Update";

const express = require("express");
const router = express.Router();

router.get("/", getSubjectCareerController);
router.post("/", createCareerSubjectController);
router.patch("/", updateSubjectController);

module.exports = router;
