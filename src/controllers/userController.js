const User = require("../models/userModel");

const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los usuarios" });
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
};
