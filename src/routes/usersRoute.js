const express = require("express");
const router = express.Router();

// Controladores
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

const {
  getProfile,
  updateProfile,
} = require("../controllers/profileController");

// Middleware
const verifyToken = require("../middleware/verifyToken");

// Rutas públicas
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/", getUsers);
router.get("/search/:users", searchUsers);
router.get("/search/:games", searchUsersByGames);
router.get("/search/:platforms", searchUsersByPlatforms);

// Rutas protegidas para perfil
router.get("/profile", verifyToken, getProfile);
router.put("/profile", verifyToken, updateProfile);

module.exports = router;
