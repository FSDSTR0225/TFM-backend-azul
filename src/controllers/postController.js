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

// Obtener un post por ID con comentarios
const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("creator", "username avatar")
      .populate("game", "name")
      .populate("platform", "name icon")
      .populate("comments.author", "username avatar");

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

// Añadir comentario a un post (comentarios embebidos)
const addCommentToPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;

    if (!content) {
      return res
        .status(400)
        .json({ message: "El comentario no puede estar vacío" });
    }

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post no encontrado" });

    const newComment = {
      content,
      author: req.user.id,
    };

    post.comments.push(newComment);
    await post.save();

    // Poblar el autor del comentario insertado
    const populatedPost = await Post.findById(postId).populate(
      "comments.author",
      "username avatar"
    );

    const addedComment =
      populatedPost.comments[populatedPost.comments.length - 1];

    res.status(201).json(addedComment);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al añadir comentario", error: error.message });
  }
};

// Obtener comentarios de un post
const getCommentsByPost = async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId).populate(
      "comments.author",
      "username avatar"
    );

    if (!post) {
      return res.status(404).json({ message: "Post no encontrado" });
    }

    res.status(200).json(post.comments);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener comentarios", error });
  }
};

// Editar comentario
const updateComment = async (req, res) => {
  const { postId, commentId } = req.params;
  const { content } = req.body;

  if (!content) {
    return res
      .status(400)
      .json({ message: "El comentario no puede estar vacío" });
  }

  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post no encontrado" });

    // Buscar el comentario embebido
    const comment = post.comments.id(commentId);
    if (!comment)
      return res.status(404).json({ message: "Comentario no encontrado" });

    // Solo puede editar el autor del comentario
    if (comment.author.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "No autorizado para editar este comentario" });
    }

    comment.content = content;
    await post.save();

    // Poblar autor actualizado para devolverlo
    const populatedPost = await Post.findById(postId).populate(
      "comments.author",
      "username avatar"
    );
    const updatedComment = populatedPost.comments.id(commentId);

    res.status(200).json(updatedComment);
  } catch (error) {
    res.status(500).json({
      message: "Error al actualizar comentario",
      error: error.message,
    });
  }
};

// Borrar comentario
const deleteComment = async (req, res) => {
  const { postId, commentId } = req.params;

  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post no encontrado" });

    const comment = post.comments.id(commentId);
    if (!comment)
      return res.status(404).json({ message: "Comentario no encontrado" });

    // Solo autor del comentario o creador del post pueden borrar
    if (
      comment.author.toString() !== req.user.id &&
      post.creator.toString() !== req.user.id
    ) {
      return res
        .status(403)
        .json({ message: "No autorizado para borrar este comentario" });
    }

    comment.remove();
    await post.save();

    return res
      .status(200)
      .json({ message: "Comentario eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar comentario:", error);
    return res.status(500).json({
      message: "Error al eliminar comentario",
      error: error.message,
    });
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  addCommentToPost,
  getCommentsByPost,
  updateComment,
  deleteComment,
};
