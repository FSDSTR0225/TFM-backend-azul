const EventModel = require("../models/eventsModel");

const createEvent = async (req, res) => {
  try {
    const {
      title,
      game,
      platform,
      date,
      hour,
      description,
      creator,
      image = "",
    } = req.body;

    // Aquí crea el evento con la data recibida, image puede no venir
    const newEvent = new EventModel({
      title,
      game,
      platform,
      date,
      hour,
      description,
      creator,
      image,
    });

    await newEvent.save();

    res.status(201).json(newEvent);
  } catch (error) {
    console.error("Error al crear evento:", error);
    res
      .status(500)
      .json({ message: "Error creando evento", error: error.message });
  }
};

module.exports = {
  createEvent,
};
