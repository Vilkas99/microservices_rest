import { createUser } from "../../controllers/Register/Create";
import {
  getUserData,
  getAllUsersTypeData,
} from "../../controllers/Register/Get";

const express = require("express");
const router = express.Router();

router.get("/get", getUserData);
router.get("/getAll", getAllUsersTypeData);
router.post("/create", createUser);
router.patch("/", () => {});

module.exports = router;
