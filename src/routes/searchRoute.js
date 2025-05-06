const express = require("express");
const router = express.Router();
const {
  searchAll,
  searchOnlyUsers,
  searchOnlyGames,
  searchOnlyEvents,
} = require("../controllers/searchController");

router.get("/", searchAll); // ruta para buscar sin  filtrar por nada, devuelve todos los resultados.
router.get("/users", searchOnlyUsers); //ruta para buscar solo por usuarios.
router.get("/games", searchOnlyGames); //ruta para buscar solo por juegos.
router.get("/events", searchOnlyEvents); //ruta para buscar solo por eventos.

module.exports = router;
