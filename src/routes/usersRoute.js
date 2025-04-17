const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
} = require("../controllers/registerAndLoginUsersController");
const {
  getUsers,
  searchUsers,
  searchUsersByGames,
  searchUsersByPlatforms,
  getUserById,
} = require("../controllers/userController");

const {
  addFavoriteGame,
  deleteFavoriteGame,
} = require("../controllers/favoriteGameController");
const {
  addFavoritePlatform,
  deleteFavoritePlatform,
} = require("../controllers/favoritePlatformController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/", getUsers);
router.get("/search/:users", searchUsers);
router.get("/search/:games", searchUsersByGames);
router.get("/search/:platforms", searchUsersByPlatforms);
router.get("/:userId", getUserById);
router.post("/:userId/favoriteGames", addFavoriteGame);
router.delete("/:userId/favoriteGames/:gameId", deleteFavoriteGame);
router.post("/:userId/platforms", addFavoritePlatform);
router.delete("/:userId/platforms/:platformsId", deleteFavoritePlatform);

module.exports = router;
