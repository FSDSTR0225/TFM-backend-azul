const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
} = require("../controllers/registerAndLoginUsersController");
const {
  getUsers,
  searchUsers,
  searchUsersByGames,
  searchUsersByPlatforms,
  getUserById,
} = require("../controllers/userController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", getMe);
router.get("/", getUsers);
router.get("/search/:users", searchUsers);
router.get("/search/:games", searchUsersByGames);
router.get("/search/:platforms", searchUsersByPlatforms);
router.get("/:userId", getUserById);

module.exports = router;
