const mongoose = require("mongoose");

const platformSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    icon: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      match: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      lowercase: true,
    },
    order: {
      type: Number,
      required: true,
      unique: true, // Aseguramos que el orden sea único para evitar conflictos
    },
  },
  { timestamps: true }
);

const Platform = mongoose.model("Platform", platformSchema);
module.exports = Platform;
