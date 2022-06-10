import { getUserLogin } from "../../controllers/Login/Get";
import { updateVerification } from "../../controllers/Login/Update";

const express = require("express");
const router = express.Router();

router.get("/get", getUserLogin);
router.post("/", () => {});
router.patch("/verify", updateVerification);

module.exports = router;
