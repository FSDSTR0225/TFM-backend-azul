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
// const { updateTags } = require("../controllers/tagsController");
const { addTags, deleteTags } = require("../controllers/tagsController");
const verifyToken = require("../middlewares/verifyToken");

router.post("/favoriteGames", verifyToken, addFavoriteGame);
router.delete("/favoriteGames/:gameId", verifyToken, deleteFavoriteGame);
router.post("/platforms", verifyToken, addFavoritePlatform);
router.delete("/platforms/:platformId", verifyToken, deleteFavoritePlatform);
router.put("/editProfile", verifyToken, editProfile);
router.post("/friends", verifyToken, addFriend);
router.delete("/friends/:friendId", verifyToken, deleteFriend);
router.post("/tags/:tagsType", verifyToken, addTags);
router.delete("/tags/:tagsType/:tag", verifyToken, deleteTags);

module.exports = router;
