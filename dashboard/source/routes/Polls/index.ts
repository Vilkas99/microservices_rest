import { getQuestionController } from "../../controllers/PollQuestions/Get";
import { createPollReportController } from "../../controllers/PollReports/Create";
import { getPollReportController } from "../../controllers/PollReports/Get";

const express = require("express");
const router = express.Router();

router.get("/", getQuestionController);
router.get("/getPoll/", getPollReportController);
router.post("/", createPollReportController);

module.exports = router;
