import { getCareerSubjectsController } from "../../controllers/CareerSubject/Get";
import { createCareerSubjectController } from "../../controllers/CareerSubject/Create";
import { updateCareerSubjectController } from "../../controllers/CareerSubject/Update";
import { deleteCareerSubjectController } from "../../controllers/CareerSubject/Delete";

const express = require("express");
const router = express.Router();

router.get("/", getCareerSubjectsController);
router.post("/", createCareerSubjectController);
router.patch("/", updateCareerSubjectController);
router.delete("/", deleteCareerSubjectController);

module.exports = router;
