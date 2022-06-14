import {
  getNotification,
  getAllNotifications,
} from "../../controllers/Notification/Get";

import { createNotification } from "../../controllers/Notification/Create";

import { updateNotification } from "../../controllers/Notification/Update";

const express = require("express");
const router = express.Router();

router.get("/", getNotification);
router.get("/all", getAllNotifications);

router.post("/", createNotification);

router.patch("/", updateNotification);

module.exports = router;
