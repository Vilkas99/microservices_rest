import { updateController } from "../../controllers/Appointments/Update";
import { createController } from "../../controllers/Appointments/Create";
import {
  getAdmin,
  getStatus,
  getAll,
} from "../../controllers/Appointments/Get";

const express = require("express");
const router = express.Router();

router.post("/", createController);
router.patch("/", updateController);
router.get("/admin", getAdmin);
router.get("/status", getStatus);
router.get("/allAppointments", getAll);

module.exports = router;
