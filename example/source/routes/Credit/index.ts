//Controllers
import { getAllCredits, getCredit } from "../../controllers/Credit/Get";
import { UpdateCredit } from "../../controllers/Credit/Update";

const  express =  require("express");
const router = express.Router();

//Gets
router.get("/", getCredit)
router.get("/all", getAllCredits)

//Updates/Patch
router.patch("/", UpdateCredit)

module.exports = router