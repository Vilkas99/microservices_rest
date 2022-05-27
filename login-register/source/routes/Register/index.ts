import { createUser } from "../../controllers/Register/Create";
import {
  getUserData,
  getAllUsersTypeData,
} from "../../controllers/Register/Get";
import { updateUser } from "../../controllers/Register/Update";

const express = require("express");
const router = express.Router();

router.get("/get", getUserData);
router.get("/getAll", getAllUsersTypeData);
router.post("/create", createUser);
router.patch("/update", updateUser);

module.exports = router;
