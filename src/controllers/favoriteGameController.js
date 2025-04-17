const User = require("../models/userModel");

const addFavoriteGame = async (req, res) => {
  try {
    const userId = req.params.userId; // obtenemos el user id de la URL
    const gameId = req.body.gameId; // Obtenemos el ID del juego de la peticion cuando lo indicamos en el frontend (hacemos click en el chips)

    const user = await User.findById(userId); // Buscamos al usuario en la base de datos
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Comprobamos que el juego no esta ya en favoritos,le hacemos somo que compara si al menos 1 elemento cumpel la condicion,
    //y con equals.da igual si le llega string u objectId que lo compara y si esta ya no lo añade.
    if (user.favoriteGames.some((game) => game.equals(gameId))) {
      return res
        .status(400)
        .json({ message: "Este juego ya esta añadido a tus favoritos" });
    }

    user.favoriteGames.push(gameId);
    await user.save(); // lo añadimos y guardamos cambios.

    return res
      .status(200)
      .json({ message: "Juego añadido a favoritos", gameId });
  } catch (error) {
    return res.status(500).json({
      message: "Error al añadir el juego a favoritos",
      error: error.message,
    });
  }
};

const deleteFavoriteGame = async (req, res) => {
  try {
    const { userId, gameId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    user.favoriteGames = user.favoriteGames.filter(
      (favoriteGamesId) => favoriteGamesId.toString() !== gameId
    );

    await user.save();

    return res
      .status(200)
      .json({ message: "Juego eliminado de favoritos", gameId });
  } catch (error) {
    return res.status(500).json({
      message: "Error al eliminar el juego de favoritos",
      error: error.message,
    });
  }
};

module.exports = { addFavoriteGame, deleteFavoriteGame };
