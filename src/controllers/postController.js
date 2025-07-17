const Post = require("../models/postModel");

// Crear un nuevo post
const createPost = async (req, res) => {
  const { title, description, game, platform, category } = req.body;

  if (!title || !description || !game || !platform || !category) {
    return res.status(400).json({ message: "Faltan campos obligatorios" });
  }

  try {
    const newPost = new Post({
      category,
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
};

// Obtener todos los posts
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("creator", "username avatar")
      .populate("game", "name")
      .populate("platform", "name icon")
      .sort({ createdAt: -1 });

    res.status(200).json({ posts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener un post por ID
const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("creator", "username avatar")
      .populate("game", "name")
      .populate("platform", "name icon")
      .populate({
        path: "comments",
        populate: {
          path: "author",
          select: "username avatar",
        },
      });

    if (!post) return res.status(404).json({ message: "Hilo no encontrado" });

    res.status(200).json({ post });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Editar un post
const updatePost = async (req, res) => {
  const { title, description, game, platform, category } = req.body;

  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Hilo no encontrado" });

    if (post.creator.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "No autorizado para editar este hilo" });
    }

    post.title = title || post.title;
    post.description = description || post.description;
    post.game = game || post.game;
    post.platform = platform || post.platform;
    post.category = category || post.category;

    await post.save();

    const updatedPost = await Post.findById(post._id)
      .populate("creator", "username avatar")
      .populate("game", "name")
      .populate("platform", "name icon");

    res
      .status(200)
      .json({ message: "Hilo actualizado correctamente", post: updatedPost });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar un post
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Hilo no encontrado" });

    if (post.creator.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "No autorizado para eliminar este hilo" });
    }

    await post.deleteOne();
    res.status(200).json({ message: "Hilo eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error del servidor" });
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
};
