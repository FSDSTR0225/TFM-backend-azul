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
const { addFriend, deleteFriend } = require("../controllers/friendsController");
const { editProfile } = require("../controllers/profileInfoController");

const verifyToken = require("../middlewares/verifyToken");
router.post("/favoriteGames", verifyToken, addFavoriteGame);
router.delete("/favoriteGames/:gameId", verifyToken, deleteFavoriteGame);
router.post("/platforms/:platformId", verifyToken, addFavoritePlatform);
router.delete("/platforms/:platformId", verifyToken, deleteFavoritePlatform);
router.post("/editProfile", verifyToken, editProfile);
router.post("/friends", verifyToken, addFriend);
router.delete("/friends/:friendId", verifyToken, deleteFriend);
module.exports = router;
