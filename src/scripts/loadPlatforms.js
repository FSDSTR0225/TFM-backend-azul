require("dotenv").config();
const mongoose = require("mongoose");
const Platform = require("../models/platformModel");

const platforms = [
  { name: "PC", icon: "/images/platforms/PC2.png" },
  { name: "PS5", icon: "/images/platforms/ps5.png" },
  { name: "PS4", icon: "/images/platforms/ps41.png" },
  { name: "Xbox", icon: "/images/platforms/xbox1.png" },
  { name: "Nintendo Switch", icon: "/images/platforms/switch.png" },
  { name: "Mobile", icon: "/images/platforms/mobile.png" },
];

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Conectado a la base de datos");

    // Eliminar todas las plataformas anteriores
    await Platform.deleteMany({});
    console.log("Todas las plataformas eliminadas");

    // Insertar nuevas plataformas
    await Platform.insertMany(platforms);
    console.log("Nuevas plataformas insertadas correctamente");

    mongoose.connection.close();
  })
  .catch((error) => {
    console.error("Error de conexión:", error);
    mongoose.connection.close();
  });
