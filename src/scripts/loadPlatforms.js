require("dotenv").config();
const mongoose = require("mongoose");
const { Types } = require("mongoose");
const Platform = require("../models/platformModel");

const platforms = [
  {
    _id: new Types.ObjectId("681224bc8520bbed4685db9f"),
    name: "PC",
    slug: "pc",
    icon: "/images/platforms/PC2.png",
  },
  {
    _id: new Types.ObjectId("681224bc8520bbed4685dba0"),
    name: "PS5",
    slug: "playstation5",
    icon: "/images/platforms/ps5.png",
  },
  {
    _id: new Types.ObjectId("681224bc8520bbed4685dba1"),
    name: "PS4",
    slug: "playstation4",
    icon: "/images/platforms/ps41.png",
  },
  {
    _id: new Types.ObjectId("681224bc8520bbed4685dba2"),
    name: "Xbox",
    slug: "xbox-series-x",
    icon: "/images/platforms/xbox1.png",
  },
  {
    _id: new Types.ObjectId("681224bc8520bbed4685dba3"),
    name: "Nintendo Switch",
    slug: "nintendo-switch",
    icon: "/images/platforms/switch.png",
  },
  {
    _id: new Types.ObjectId("681224bc8520bbed4685dba4"),
    name: "Mobile",
    slug: "mobile", // ios y android se transforman en "mobile" en el script
    icon: "/images/platforms/mobile.png",
  },
];

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
<<<<<<< HEAD
    console.log("Conectado a la base de datos");

    // Eliminar todas las plataformas anteriores
    await Platform.deleteMany({});
    console.log("Todas las plataformas eliminadas");

    // Insertar nuevas plataformas
    await Platform.insertMany(platforms);
    console.log("Nuevas plataformas insertadas correctamente");
=======
    console.log(" Conectado a MongoDB");

    await Platform.deleteMany();
    console.log(" Todas las plataformas eliminadas");

    await Platform.insertMany(platforms);
    console.log(" Nuevas plataformas insertadas correctamente");
>>>>>>> Features-1

    mongoose.connection.close();
  })
  .catch((error) => {
<<<<<<< HEAD
    console.error("Error de conexión:", error);
=======
    console.error(" Error de conexión:", error);
>>>>>>> Features-1
    mongoose.connection.close();
  });
