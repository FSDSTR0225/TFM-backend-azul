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

const verifyToken = require("../middlewares/verifyToken");
router.post("/favoriteGame/:gameId", verifyToken, addFavoriteGame);
router.delete("/favoriteGames/:gameId", verifyToken, deleteFavoriteGame);
router.post("/platforms/:platformId", verifyToken, addFavoritePlatform);
router.delete("/platforms/:platformId", verifyToken, deleteFavoritePlatform);

module.exports = router;
