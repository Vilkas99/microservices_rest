import { getAllSchedules } from "../../controllers/Schedule/Get";
import { createSchedule } from "../../controllers/Schedule/Create";
import { updateSchedule } from "../../controllers/Schedule/Update";

const express = require("express");
const router = express.Router();

router.get("/", getAllSchedules);
router.post("/", createSchedule);
router.patch("/", updateSchedule);

module.exports = router;
