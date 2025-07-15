const express = require("express");
const router = express.Router();
const { translateDescription } = require("../controllers/translateController");

router.post("/", translateDescription);

module.exports = router;
