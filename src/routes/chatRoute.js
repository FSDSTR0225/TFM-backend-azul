const express = require("express");
const router = express.Router();

const verifyToken = require("../middlewares/verifyToken");
const {
  getChatByFriendId,
  getUnreadMessagesCount,
  getUnreadMessagesBySender,
  markMessagesAsRead,
} = require("../controllers/chatController");

router.get("/unread-count", verifyToken, getUnreadMessagesCount);
router.get("/unread-by-sender", verifyToken, getUnreadMessagesBySender);
router.get("/:friendId", verifyToken, getChatByFriendId);
router.patch("/chats/:chatId/mark-as-read", verifyToken, markMessagesAsRead);

module.exports = router;
