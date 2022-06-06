import {
  updateCandidate,
  updateController,
} from "../../controllers/Appointments/Update";
import { createController } from "../../controllers/Appointments/Create";
import {
  email2,
  getAdmin,
  getStatus,
  getAll,
  getPossibleDates,
  getCandidates,
} from "../../controllers/Appointments/Get";

const express = require("express");
const router = express.Router();

router.post("/", createController);
router.patch("/", updateController);
router.get("/admin", getAdmin);
router.get("/status", getStatus);
router.get("/email", email2);
router.get("/allAppointments", getAll);
router.get("/possibleDates", getPossibleDates);
router.get("/candidates", getCandidates);
router.get("/updateCandidates", updateCandidate);

module.exports = router;
