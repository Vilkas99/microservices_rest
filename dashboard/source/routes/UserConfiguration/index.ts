import { getUserConfiguration } from "../../controllers/Configuration/Get";

const express = require("express");
const router = express.Router();

router.get("/", getUserConfiguration);

module.exports = router;
