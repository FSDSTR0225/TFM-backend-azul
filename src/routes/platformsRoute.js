const express = require("express");
const router = express.Router();
const { getPlatforms } = require("../controllers/platformController");
const getGamesByPlatformId = require("../controllers/getGameByPlatformIdController");

router.get("/", getPlatforms);
router.get("/:platformId/games", getGamesByPlatformId);

module.exports = router;
