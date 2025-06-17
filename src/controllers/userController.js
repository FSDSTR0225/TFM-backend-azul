const User = require("../models/userModel");
require("dotenv").config();
const getUsers = async (req, res) => {
  try {
    // Obtener los parámetros de paginación desde la query
    const page = parseInt(req.query.page) || 1; // Página actual, por defecto 1
    const limit = parseInt(req.query.limit) || 10; // Límite de resultados por página, por defecto 10
    const skip = (page - 1) * limit; // Cálculo para saltar registros

    const userId = req.user.id; // Obtiene el ID del usuario actual desde el token
    const { game, platform, time } = req.query; //  Obtener filtros de la URL
    // Construir el objeto de filtros dinámicamente
    let filters = { _id: { $ne: userId } };
    // Contar el número total de jugadores que cumplen los filtros
    const totalUsers = await User.countDocuments(filters);

    console.log("Filtros recibidos:", { game, platform, time });

    if (game) filters["favoriteGames"] = game; //  Filtrar por juego
    if (platform) filters["platforms"] = platform; //  Filtrar por plataforma
    if (time) filters["availability"] = time; //  Filtrar por horario

    // Buscar los usuarios aplicando paginación
    const users = await User.find(filters) // Excluye el usuario actual
      .select("username avatar favoriteGames platforms availability") // Selecciona los campos a devolver
      .populate("favoriteGames", "name , imageUrl")
      .populate("platforms", "name, icon")
      .sort({ _id: 1 }) // Ordena los jugadores de forma ascendente por ID

      .skip(skip) // Salta los usuarios de páginas anteriores
      .limit(limit); // Limita la cantidad de resultados

    // Enviar la respuesta con los usuarios y el total de usuarios
    res.json({ users, totalUsers });
  } catch (error) {
    console.error("Error en getUsers:", error);

    res.status(500).json({ error: "Error al obtener los usuarios" });
  }
};

const getUserByUsername = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }) // Buscamos el usuario por username
      .select(
        "username avatar favoriteGames platforms availability favoriteTags ratings"
      ) // Elegimos los campos a devolver de la ficha publica
      .populate("favoriteGames", "name imageUrl") // Elegimos que de favoriteGames se vea el nombre y la imagen
      .populate("platforms", "name icon"); // Elegimos que de favoritesGames  y platform se vea el nombre

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
      .select(
        "username avatar favoriteGames platforms availability friends email favoriteTags ratings" // Seleccionamos los campos que queremos devolver
      )
      .populate("favoriteGames", "name imageUrl")
      .populate("platforms", "name icon")
      .populate("friends.user", "username avatar");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ message: "User identified correctly", user });
  } catch (err) {
    console.error("❌ Errore in getMe:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getUsers,
  getUserByUsername,
  getMe,
};
