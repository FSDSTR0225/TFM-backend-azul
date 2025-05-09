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
    const { username, favoriteGames, platforms } = req.query;
    const query = {};

    if (username) {
      query.username = { $regex: username, $options: "i" };
    }

    if (favoriteGames) {
      const gameIds = favoriteGames.steamAppId
      query.favoriteGames = { $in: gameIds };
    }

    if (platforms) {
      const platformIds = platforms.name;
      query.platforms = { $in: platformIds };
    }

    const users = await User.find(query).populate('favoriteGames').populate('platforms');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Error al buscar los usuarios" });
  }
};

module.exports = {
  getUsers,
  searchUsers
};