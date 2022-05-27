import { createUser } from "../../controllers/Register/Create";
import {
  getUserData,
  getAllUsersTypeData,
} from "../../controllers/Register/Get";
import { updateUser } from "../../controllers/Register/Update";
import { deleteUser } from "../../controllers/Register/Delete";

const express = require("express");
const router = express.Router();

router.get("/get", getUserData);
router.get("/getAll", getAllUsersTypeData);
router.post("/create", createUser);
router.patch("/update", updateUser);
router.delete("/delete", deleteUser);

module.exports = router;
