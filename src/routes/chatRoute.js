const express = require("express");
const router = express.Router();

const verifyToken = require("../middlewares/verifyToken");
const {
  getChatByFriendId,
  getUnreadMessagesCount,
  getUnreadMessagesPersonalChat,
  markMessagesAsRead,
} = require("../controllers/chatController");

router.get("/unread-count", verifyToken, getUnreadMessagesCount);
router.get(
  "/unread-count/:friendId",
  verifyToken,
  getUnreadMessagesPersonalChat
);
router.get("/:friendId", verifyToken, getChatByFriendId);
router.post("/mark-read/:chatId", verifyToken, markMessagesAsRead);

module.exports = router;
