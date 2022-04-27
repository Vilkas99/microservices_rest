const express = require("express");
const router = express.Router();

router.get("/", () => {
  console.log("getting info");
});
router.post("/", () => {});
router.patch("", () => {});

module.exports = router;
