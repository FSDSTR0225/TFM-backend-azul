const express = require("express");
const router = express.Router();
const {
  addFavoriteGame,
  deleteFavoriteGame,
} = require("../controllers/favoriteGameController");
const {
  addFavoritePlatform,
  deleteFavoritePlatform,
} = require("../controllers/favoritePlatformController");
const { getProfile } = require("../controllers/profileController");
const verifyToken = require("../middlewares/verifyToken");

router.get("/", verifyToken, getProfile);
router.post("/favoriteGame/:gameId", verifyToken, addFavoriteGame);
router.delete("/favoriteGames/:gameId", verifyToken, deleteFavoriteGame);
router.post("/platforms/:platformId", verifyToken, addFavoritePlatform);
router.delete("/platforms/:platformId", verifyToken, deleteFavoritePlatform);

module.exports = router;
