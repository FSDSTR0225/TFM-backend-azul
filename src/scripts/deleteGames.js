require("dotenv").config();
const mongoose = require("mongoose");
const Game = require("../models/gameModel");

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Conectado a MongoDB");

    // Eliminar todos los juegos
    const result = await Game.deleteMany({});
    console.log(`Juegos eliminados: ${result.deletedCount}`);

    mongoose.connection.close();
  })
  .catch((error) => {
    console.error("Error al conectar o eliminar juegos:", error);
    mongoose.connection.close();
  });
