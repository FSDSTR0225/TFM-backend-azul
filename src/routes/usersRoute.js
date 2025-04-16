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
} = require("../controllers/userController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/", getUsers);
router.get("/search/:users", searchUsers);
router.get("/search/:games", searchUsersByGames);
router.get("/search/:platforms", searchUsersByPlatforms);

module.exports = router;
