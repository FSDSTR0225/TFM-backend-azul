const Platform = require("../models/platformModel");
const Game = require("../models/gameModel");

const getGamesByPlatformId = async (req, res) => {
  const { platformId } = req.params;

  try {
    const platform = await Platform.findById(platformId);

    if (!platform) {
      return res.status(404).json({ message: "Plataforma no encontrada" });
    }

    const games = await Game.find({ platforms: platformId }); //.sort({ name: 1 }) Ordenar por nombre de juego alfabeticamente

    if (games.length === 0) {
      // si el array devuelto esta vacio..
      return res.status(200).json({
        message: "No se encontraron juegos para esta plataforma",
        games: [],
        platform,
      });
    }

    return res
      .status(200)
      .json({ message: "Juegos obtenidos con éxito", games, platform });
  } catch (error) {
    return res.status(500).json({
      message: "Error al obtener los juegos de la plataforma",
      error: error.message,
    });
  }
};

module.exports = getGamesByPlatformId;
