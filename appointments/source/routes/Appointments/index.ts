import { updateController } from "../../controllers/Appointments/Update";
import { createController } from "../../controllers/Appointments/Create";

const express = require("express");
const router = express.Router();

router.get("/", () => {
  console.log("getting info");
});
router.post("/", createController);
router.patch("/", updateController);

module.exports = router;
