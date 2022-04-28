import { updateController } from "../../controllers/Appointments/Update";

const express = require("express");
const router = express.Router();

router.get("/", () => {
  console.log("getting info");
});
router.post("/", () => {});
router.patch("/", updateController);

module.exports = router;
