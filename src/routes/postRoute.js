const express = require("express");
const router = express.Router();
const Post = require("../models/postModel");
const verifyToken = require("../middlewares/verifyToken");
const authMiddleware = require("../middlewares/verifyToken");

// POST /post → Crear un nuevo hilo
router.post("/", verifyToken, async (req, res) => {
  const { title, description, game, platform } = req.body;

  if (!title || !description || !game || !platform) {
    return res.status(400).json({ message: "Faltan campos obligatorios" });
  }

  try {
    const newPost = new Post({
      title,
      description,
      game,
      platform,
      creator: req.user.id,
    });

    await newPost.save();

    const populatedPost = await Post.findById(newPost._id)
      .populate("creator", "username avatar")
      .populate("game", "name")
      .populate("platform", "name icon");

    res
      .status(201)
      .json({ message: "Post creado correctamente", post: populatedPost });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /post → Obtener todos los hilos
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("creator", "username avatar") // Muestra solo el username del creador
      .populate("game", "name") // Muestra solo el nombre del juego
      .populate("platform", "name icon") // Muestra solo el nombre de la plataforma
      .sort({ createdAt: -1 }); // Ordena por fecha descendente

    res.json({ posts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", verifyToken, async (req, res) => {
  console.log("→ Intentando borrar hilo", req.params.id);
  console.log("→ Usuario autenticado:", req.user.id);
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Hilo no encontrado" });
    }

    if (post.creator.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "No autorizado para eliminar este hilo" });
    }

    await post.deleteOne();
    res.status(200).json({ message: "Hilo eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar hilo:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
});

module.exports = router;
