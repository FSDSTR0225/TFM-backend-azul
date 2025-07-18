const express = require("express");
const router = express.Router();
const {
  createEvent,
  getEvents,
  getEventById,
  joinEvent,
  updateEvent,
  deleteEvent,
  getMyCreatedEvents,
  getPastEvents,
  getEventsToday,
  leaveEvent,
  getAllMyEvents,
  getMyJoinedEvents,
  getEventsByGame,
} = require("../controllers/eventController");
const verifyToken = require("../middlewares/verifyToken");

// Obtener todos los eventos (Ruta publica)
router.get("/", getEvents);

// Rutas privadas
router.post("/", verifyToken, createEvent); // Crear evento
router.get("/today", verifyToken, getEventsToday); // Obtener eventos del dia de hoy
router.get("/by-game", verifyToken, getEventsByGame); // Obtener eventos por juego')
router.put("/:eventId", verifyToken, updateEvent); // Actualizar evento creado por mi
router.delete("/:eventId", verifyToken, deleteEvent); // Eliminar evento creado por mi
router.get("/my-events", verifyToken, getAllMyEvents); // Obtener todos los eventos en los que participo (creados por mi o a los que me he unido)
router.get("/my-events/created", verifyToken, getMyCreatedEvents); // Obtener mis eventos creados
router.get("/my-events/joined", verifyToken, getMyJoinedEvents); // Obtener eventos en los que me he unido (no creados por mi, solo a los que me he unido)
router.get("/past", verifyToken, getPastEvents); // Obtener eventos pasados (creados por mi) para historial,estadisticas, gamificacion, etc.
router.get("/:eventId", verifyToken, getEventById); // Obtener detalle/acceder a un evento especifico
router.post("/:eventId/join", verifyToken, joinEvent); // Unirse/solicitar unirse a un evento especifico
router.delete("/:eventId/leave-event", verifyToken, leaveEvent); // Dejar un evento especifico al que ya estamos unidos

module.exports = router;
