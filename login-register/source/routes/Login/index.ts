import { getUserLogin } from "../../controllers/Login/Get";

const express = require("express");
const router = express.Router();

router.get("/get", getUserLogin);
router.post("/", () => {});
router.patch("/", () => {});

module.exports = router;
