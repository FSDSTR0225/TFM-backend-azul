const express = require("express");
const router = express.Router();
const {
  getUsers,
  getUserByUsername,
} = require("../controllers/userController");
const verifyToken = require("../middlewares/verifyToken");

router.get("/", verifyToken, getUsers);
router.get("/:username", verifyToken, getUserByUsername);

module.exports = router;
