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

router.get("/", getProfile);
router.post("/profile/favoriteGames", addFavoriteGame);
router.delete("/profile/favoriteGames/:gameId", deleteFavoriteGame);
router.post("/profile/platforms/:platformsId", addFavoritePlatform);
router.delete("/profile/platforms/:platformsId", deleteFavoritePlatform);

module.exports = router;
