const express = require("express");
const router = express.Router();
const {
  getUsers,
  getUserByUsername,
  getMe,
} = require("../controllers/userController");
const verifyToken = require("../middlewares/verifyToken");

router.get("/", verifyToken, getUsers);
router.get("/me", verifyToken, getMe);
router.get("/:username", verifyToken, getUserByUsername);

module.exports = router;

module.exports = router;
