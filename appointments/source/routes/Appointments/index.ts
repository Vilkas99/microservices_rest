import { updateController } from "../../controllers/Appointments/Update";
import { createController } from "../../controllers/Appointments/Create";
import {
  getAdmin,
  getStatus,
  getAll,
  getPossibleDates,
} from "../../controllers/Appointments/Get";
import { updateDetailsController } from "../../controllers/Appointments-User/Update";

const express = require("express");
const router = express.Router();

router.post("/", createController);
router.patch("/", updateController);
router.patch("/details", updateDetailsController);
router.get("/admin", getAdmin);
router.get("/status", getStatus);
router.get("/allAppointments", getAll);
router.get("/possibleDates", getPossibleDates);

module.exports = router;
