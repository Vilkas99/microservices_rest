import { createUser } from "../../controllers/Register/Create";

const express = require("express");
const router = express.Router();

router.get("/", () => {
  console.log("getting info");
});
router.post("/create", createUser);
router.patch("/", () => {});

module.exports = router;
