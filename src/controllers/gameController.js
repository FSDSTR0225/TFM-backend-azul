const Game = require("../models/gameModel");

const getGames = async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Si no se pasa la página o se pasa mal,por defecto será la 1.
  const pageSize = 25;
  try {
    const games = await Game.find()
      .sort({ name: 1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize);
    //  Obtenemos los juegos por paginacion, usamos sort para ordenarlos por orden alfabético(1 = orden ascendente de A a Z), usamos skip para la paginacion y
    //que sepa que juegos skipear, (Ej si estamos en pagina 2,page=2 serian (2-1)*25 = 25,se omitirian los primeros 25 juegos) y por ultimo limit - limita los juegos a lo marcado en la const pageSize.
    res.status(201).json(games);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getGameById = async (req, res) => {
  const { id, rawgId } = req.params;
  try {
    const gameId = await Game.findById(id);
    if (!gameId) {
      return res.status(404).json({ error: "Juego no encontrado" });
    }
    res.status(200).json(gameId);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getGameByRawgId = async (req, res) => {
  const { rawgId } = req.params;
  try {
    const gameId = await Game.findOne({ rawgId });
    if (!gameId) {
      return res.status(404).json({ error: "Juego no encontrado" });
    }
    res.status(200).json(gameId);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { getGames, getGameById, getGameByRawgId };
