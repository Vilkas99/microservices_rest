import { getAllAdmins, getAdmin } from "../../controllers/Admin/Get";

const  express =  require("express");
const router = express.Router();

router.get("/", getAdmin)
router.get("/all", getAllAdmins)


module.exports = router