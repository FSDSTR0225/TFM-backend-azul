const express = require("express");
const router = express.Router();
const {
  getUsers,
  getUserByUsername,
  getMe,
} = require("../controllers/userController");
const verifyToken = require("../middlewares/verifyToken");
const {
  registerUser,
  loginUser,
} = require("../controllers/registerAndLoginUsersController");

router.get("/", verifyToken, getUsers);
router.get("/me", verifyToken, getMe);
router.get("/:username", verifyToken, getUserByUsername);
router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;

module.exports = router;
