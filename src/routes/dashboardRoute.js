const express = require("express");
const router = express.Router();
const { getDailySummary } = require("../controllers/dashboardController");
const verifyToken = require("../middlewares/verifyToken");

router.get("/summary", verifyToken, getDailySummary);

module.exports = router;
