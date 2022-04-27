import { getConsultant, getAllConsultants } from "../../controllers/Consultants/Get";
import { UpdateConsulant } from "../../controllers/Consultants/Update";

const  express =  require("express");
const router = express.Router();

//Gets
router.get("/", getConsultant)
router.get("/all", getAllConsultants)

//Updates/Patch
router.patch("/", UpdateConsulant)

module.exports = router