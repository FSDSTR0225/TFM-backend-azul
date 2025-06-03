const express = require("express");
const router = express.Router();
const {
  createEvent,
  getEvents,
  getEventById,
  joinEvent,
  updateEvent,
  deleteEvent,
  getMyEvents,
  getPastEvents,
  getEventsToday,
  leaveEvent,
} = require("../controllers/eventController");
const verifyToken = require("../middlewares/verifyToken");

// Obtener todos los eventos (Ruta publica)
router.get("/", getEvents);

// Rutas privadas
router.post("/", verifyToken, createEvent); // Crear evento
router.get("/today", verifyToken, getEventsToday); // Obtener eventos del dia de hoy
router.put("/:eventId", verifyToken, updateEvent); // Actualizar evento creado por mi
router.delete("/:eventId", verifyToken, deleteEvent); // Eliminar evento creado por mi
router.get("/my-events", verifyToken, getMyEvents); // Obtener mis eventos creados
router.get("/:eventId", verifyToken, getEventById); // Obtener detalle/acceder a un evento especifico
router.post("/:eventId/join", verifyToken, joinEvent); // Unirse/solicitar unirse a un evento especifico
router.delete("/:eventId/leaveEvent", verifyToken, leaveEvent); // Dejar un evento especifico al que ya estamos unidos
router.get("/past", verifyToken, getPastEvents); // Obtener eventos pasados (creados por mi) para historial,estadisticas, gamificacion, etc.

module.exports = router;
