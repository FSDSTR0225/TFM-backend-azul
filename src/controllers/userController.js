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

const getUserByUsername = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }) // Buscamos el usuario por username
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

const getMe = async (req, res) => {
  try {
    const secretKey = process.env.JWT_SECRET;
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

    if (!token) {
      return res.status(401).json({ message: "Access token missing" });
    }

    const decoded = jwt.verify(token, secretKey);

    const user = await User.findOne({ username: decoded.username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json({ message: "user identified correctly", user: user });
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

module.exports = {
  getUsers,
  getUserByUsername,
  getMe,
};
