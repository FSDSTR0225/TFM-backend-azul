const express = require("express");
const verifyToken = require("../middlewares/verifyToken");
const { sendMessageIa } = require("../controllers/chatbotController");
const router = express.Router();

router.post("/", verifyToken, sendMessageIa);

module.exports = router;
