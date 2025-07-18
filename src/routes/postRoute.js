const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");
const {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  addCommentToPost,
  getCommentsByPost,
  updateComment,
  deleteComment,
} = require("../controllers/postController");

router.post("/", verifyToken, createPost);
router.get("/", getAllPosts);
router.get("/:id", getPostById);
router.put("/:id", verifyToken, updatePost);
router.delete("/:id", verifyToken, deletePost);
router.post("/:postId/comments", verifyToken, addCommentToPost);
router.get("/:postId/comments", getCommentsByPost);
router.put("/:postId/comments/:commentId", verifyToken, updateComment);
router.delete("/:postId/comments/:commentId", verifyToken, deleteComment);

module.exports = router;
