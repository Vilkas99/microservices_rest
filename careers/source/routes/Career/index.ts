import { getCareerController } from "../../controllers/Careers/Get";
import { getCareerDoubleDegreeController } from "../../controllers/Careers/Get";
import { getAllCareersController } from "../../controllers/Careers/Get";
import { getAllCareersPaginatedController } from "../../controllers/Careers/Get";
import { createCareerController } from "../../controllers/Careers/Create";
import { updateCareerController } from "../../controllers/Careers/Update";
import { deleteCareerController } from "../../controllers/Careers/Delete";

const express = require("express");
const router = express.Router();

router.get("/career-double-degree", getCareerDoubleDegreeController);
router.get("/all-careers-paginated", getAllCareersPaginatedController);
router.get("/all-careers", getAllCareersController);
router.get("/", getCareerController);
router.post("/", createCareerController);
router.patch("/", updateCareerController);
router.delete("/", deleteCareerController);

module.exports = router;
