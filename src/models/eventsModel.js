const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  game: { type: String, required: true },
  platform: { type: String, required: true },
  date: { type: String, required: true },
  hour: { type: String, required: true },
  description: { type: String, required: true },
  creator: { type: String, required: true },
  image: { type: String, required: false, default: "" },
});

// 👉 Limpieza por si hay hot reload
delete mongoose.connection.models["Event"];

module.exports = mongoose.model("Event", eventSchema);
