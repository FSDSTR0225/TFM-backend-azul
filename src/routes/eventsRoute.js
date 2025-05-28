const express = require("express");
const router = express.Router();
const { createEvent } = require("../controllers/eventController");
const Event = require("../models/eventModel");

// GET todos los eventos
router.get("/", async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener eventos" });
  }
});

// POST crear nuevo evento
router.post("/", createEvent);

// PUT actualizar evento
router.put("/:id", async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    if (!updatedEvent) {
      return res.status(404).json({ error: "Evento no encontrado" });
    }

    res.json(updatedEvent);
  } catch (error) {
    console.error("Error al actualizar evento:", error);
    res.status(500).json({ error: "Error al actualizar evento" });
  }
});

// DELETE eliminar evento
router.delete("/:id", async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: "Evento eliminado" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar evento" });
  }
});

module.exports = router;
