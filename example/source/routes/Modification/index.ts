//Controllers
import {getModification, getAllModifications } from '../../controllers/Modifications/Get'

const  express =  require("express");
const router = express.Router();

//Gets
router.get("/", getModification)
router.get("/all", getAllModifications)


module.exports = router