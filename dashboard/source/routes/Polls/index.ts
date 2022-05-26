import { getQuestionController } from "../../controllers/PollQuestions/Get";

const express = require("express");
const router = express.Router();

router.get("/", getQuestionController);

module.exports = router;
