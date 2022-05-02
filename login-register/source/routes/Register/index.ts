import { createUser } from "../../controllers/Register/Create";
import { getUserData } from "../../controllers/Register/Get";

const express = require("express");
const router = express.Router();

router.get("/get", getUserData);
router.post("/create", createUser);
router.patch("/", () => {});

module.exports = router;
