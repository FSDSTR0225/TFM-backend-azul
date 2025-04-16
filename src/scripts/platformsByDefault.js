// require("dotenv").config();
// const mongoose = require("mongoose");
// const Platform = require("../models/platformModel"); // Asegúrate de que la ruta sea correcta

// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(async () => {
//     console.log("Conectado a la base de datos");

//     // Limpiar los documentos con slug: null
//     await Platform.updateMany({ slug: null }, { $unset: { slug: "" } });

//     // Ahora eliminar cualquier restricción de índice en slug
//     await Platform.collection.dropIndex("slug_1");

//     console.log("Índice 'slug_1' eliminado correctamente");

//     mongoose.connection.close();
//   })
//   .catch((error) => {
//     console.error("Error de conexión:", error);
//     mongoose.connection.close();
//   });

require("dotenv").config();
const mongoose = require("mongoose");
const Platform = require("../models/platformModel"); // Asegúrate de que la ruta sea correcta

// Listado de plataformas a insertar
const platforms = [
  { name: "PC", icon: "default-icon-url" },
  { name: "PS5", icon: "default-icon-url" },
  { name: "PS4", icon: "default-icon-url" },
  { name: "Xbox", icon: "default-icon-url" },
  { name: "Nintendo Switch", icon: "default-icon-url" },
  { name: "Mobile", icon: "default-icon-url" },
];

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Conectado a la base de datos");
    await Platform.deleteMany({});

    console.log("Todas las plataformas existentes han sido eliminadas");

    for (let i = 0; i < platforms.length; i++) {
      const platform = platforms[i];

      const existingPlatform = await Platform.findOne({ name: platform.name });
      if (!existingPlatform) {
        await Platform.create(platform);
        console.log(`Plataforma ${platform.name} insertada con éxito`);
      }
    }

    mongoose.connection.close();
  })
  .catch((error) => {
    console.error("Error de conexión:", error);
    mongoose.connection.close();
  });
