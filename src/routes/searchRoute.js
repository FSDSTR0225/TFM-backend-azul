const express = require("express");
const router = express.Router();
const {
  searchAll,
  searchOnlyUsers,
  searchOnlyGames,
  searchOnlyEvents,
  // searchOnlyPlatforms
} = require("../controllers/searchController");
const { route } = require("./profileRoute");

router.get("/", searchAll); // ruta para buscar sin  filtrar por nada, devuelve todos los resultados.
router.get("/users", searchOnlyUsers); //ruta para buscar solo por usuarios.
router.get("/users", searchOnlyUsers);
router.get("/games", searchOnlyGames); //ruta para buscar solo por juegos.
router.get("/platforms", searchOnlyPlatforms); //ruta para buscar solo por plataformas.
router.get("/events", searchOnlyEvents); //ruta para buscar solo por eventos.

module.exports = router;
