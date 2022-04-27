//Controllers
import deleteDebt from "../../controllers/Debts/Delete";
import {getDebt, getAllDebts, getAllPendingPayments } from "../../controllers/Debts/Get";
import payDebt from "../../controllers/Debts/Update";

const  express =  require("express");
const router = express.Router();

//Gets
router.get("/", getDebt)
router.get("/debt/all", getAllDebts)
router.get("/payment/all", getAllPendingPayments)

//Updates/Patch
router.patch("/pay", payDebt)

//Delete
router.delete("/delete", deleteDebt)

module.exports = router