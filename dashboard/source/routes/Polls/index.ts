import { getQuestionController } from "../../controllers/PollQuestions/Get";
import { createPollReportController } from "../../controllers/PollReports/Create";
import { getPollReportController } from "../../controllers/PollReports/Get";
import { createPollQuestionsController } from "../../controllers/PollQuestions/Create";

const express = require("express");
const router = express.Router();

router.get("/", getQuestionController);
router.get("/getPoll/", getPollReportController);
router.post("/", createPollReportController);
router.post("/createPoll", createPollQuestionsController);

module.exports = router;
