import { getQuestionController } from "../../controllers/PollQuestions/Get";
import { createPollReportController } from "../../controllers/PollReports/Create";

const express = require("express");
const router = express.Router();

router.get("/", getQuestionController);
router.post("/", createPollReportController);

module.exports = router;
