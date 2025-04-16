const express = require("express");
const router = express.Router();
const getGames = require("../controllers/gameController");

router.get("/", getGames);

module.exports = router;
