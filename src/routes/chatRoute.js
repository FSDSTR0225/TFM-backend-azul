const express = require("express");
const router = express.Router();

const verifyToken = require("../middlewares/verifyToken");
const {
  getChatByFriendId,
  getUnreadMessagesCount,
  getUnreadMessagesPersonalChat,
} = require("../controllers/chatController");

router.get("/chats/unread-count", verifyToken, getUnreadMessagesCount);
router.get("/:friendId", verifyToken, getChatByFriendId);
router.get(
  "/unread-count/:friendId",
  verifyToken,
  getUnreadMessagesPersonalChat
);

module.exports = router;
