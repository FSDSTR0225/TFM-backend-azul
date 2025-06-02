const User = require("../models/userModel");
require("dotenv").config();
const getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("username avatar favoriteGames platforms") // añado el select para que cuando muestre todos los usuarios solo venga esta info y no email,password...)
      .populate("favoriteGames", "name , imageUrl") // añado el populate para que de eso que viene me de solo el name.
      .populate("platforms", "name, icon");
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
   const userId = req.user.id; // Obtenemos el userId del token decodificado en el middleware verifyToken
    const user = await User.findById(userId) // Buscamos al usuario por su ID
      .select("username avatar favoriteGames platforms availability friends email")
      .populate("favoriteGames", "name imageUrl")
      .populate("platforms", "name icon")
      .populate("friends", "username avatar");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ message: "User identified correctly", user });
  } catch (err) {
    console.error("❌ Errore in getMe:", err);
    return res.status(500).json({ message: "Server error" });
  }
}


module.exports = {
  getUsers,
  getUserByUsername,
  getMe,
};
