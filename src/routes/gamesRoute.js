const express = require("express");
const router = express.Router();
const {
  getGames,
  getGameById,
  getGameByRawgId,
} = require("../controllers/gameController");

router.get("/", getGames);
router.get("/rawg/:id", getGameByRawgId); // Endpoint para obtener un juego por su ID de RAWG
router.get("/:id", getGameById);

module.exports = router;
