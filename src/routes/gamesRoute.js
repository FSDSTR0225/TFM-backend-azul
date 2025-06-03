const express = require("express");
const router = express.Router();
const { getGames, getGameById } = require("../controllers/gameController");
const { getPlatformsForGame } = require("../controllers/platformController");

router.get("/", getGames);
router.get("/:id", getGameById);
router.get("/:id/platforms", getPlatformsForGame);

module.exports = router;
