const mongoose = require("mongoose");
const widgetSchema = require("./widgetSchema");

const userWidgetConfigSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // Cada usuario tiene una única configuración de widgets
    },
    widgets: [widgetSchema], // Array de widgets, cada widget sigue el esquema definido en widgetModel.js
  },
  { timestamps: true }
); // Añade createdAt y updatedAt automáticamente

module.exports = mongoose.model("UserWidgetConfig", userWidgetConfigSchema);
