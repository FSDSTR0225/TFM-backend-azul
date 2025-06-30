const mongoose = require("mongoose");

const widgetSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: [
      "friends",
      "calendar",
      "gamification",
      "userSuggestions",
      "eventSuggestions",
      "iaSuggestions",
      "popularEvents",
      "gameSuggestions",
      "gameStats",
    ], // Tipos de widgets permitidos,ir metiendo mas según se vayan creando
    required: true,
  },
  x: { type: Number, default: 0 }, // Posición horizontal en el grid
  y: { type: Number, default: 0 }, // Posición vertical en el grid
  w: { type: Number, default: 1 }, // Ancho en columnas del grid
  h: { type: Number, default: 2 }, // Alto en filas del grid
  hidden: { type: Boolean, default: false }, // Para ocultar widgets
});

module.exports = widgetSchema; // Exportamos el esquema para usarlo en otros modelos
