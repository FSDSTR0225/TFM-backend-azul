const Platform = require("../models/platformModel");
const Game = require("../models/gameModel");

const getPlatforms = async (req, res) => {
  try {
    const { game } = req.query;
    if (!game) {
      const platforms = await Platform.find();
      return res
        .status(200)
        .json({ message: "Plataformas cargadas con éxito", platforms });
    }

    //Busca el juego y obtiene sus plataformas
    const gameData = await Game.findById(game);
    if (!gameData) {
      return res.status(404).json({ message: "Juego no encontrado" });
    }

    //Obtener las plataformas de ese juego
    const platforms = await Platform.find({ _id: { $in: gameData.platforms } });
    return res
      .status(200)
      .json({ message: "Plataformas cargadas con éxito", platforms });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al obtener plataformas", error: error.message });
  }
};

module.exports = getPlatforms;
