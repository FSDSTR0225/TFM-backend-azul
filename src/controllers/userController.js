const User = require("../models/userModel");

const getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("username avatar favoriteGames platforms") // añado el select para que cuando muestre todos los usuarios solo venga esta info y no email,password...)
      .populate("favoriteGames", "name") // añado el populate para que de eso que viene me de solo el name.
      .populate("platforms", "name");
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los usuarios" });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("username avatar favoriteGames platforms aviability") // Elegimos los campos a devolver de la ficha publica
      .populate("favoriteGames", "name")
      .populate("platforms", "name"); // Elegimos que de favoritesGames  y platform se vea el nombre

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({
      message: "No es posible devolver usuario",
      error: error.message,
    });
  }
};

const searchUsers = async (req, res) => {
  try {
    const users = await User.find({
      username: { $regex: req.params.users, $options: "i" },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Error al buscar usuarios" });
  }
};

const searchUsersByGames = async (req, res) => {
  try {
    const users = await User.find({
      favoriteGames: { $regex: req.params.games, $options: "i" },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Error al buscar usuarios" });
  }
};
const searchUsersByPlatforms = async (req, res) => {
  try {
    const users = await User.find({
      platforms: { $regex: req.params.platforms, $options: "i" },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Error al buscar usuarios" });
  }
};

module.exports = {
  getUsers,
  searchUsers,
  searchUsersByGames,
  searchUsersByPlatforms,
  getUserById,
};
