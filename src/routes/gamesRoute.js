const express = require("express");
const router = express.Router();
const {
  getGames,
  getGameById,
  getFriendsWhoLikeGame,
} = require("../controllers/gameController");
const { getPlatformsForGame } = require("../controllers/platformController");
const verifyToken = require("../middlewares/verifyToken");

router.get("/", getGames);
router.get("/:id", getGameById);
router.get("/:id/platforms", getPlatformsForGame);
router.get("/:id/friends-like", verifyToken, getFriendsWhoLikeGame);

module.exports = router;
