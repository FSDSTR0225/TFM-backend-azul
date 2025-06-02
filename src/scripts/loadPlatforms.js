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
    order: 1, // orden para que se muestre primero en la lista
  },
  {
    _id: new Types.ObjectId("681224bc8520bbed4685dba0"),
    name: "PS5",
    slug: "playstation5",
    icon: "/images/platforms/ps5.png",
    order: 2, // orden para que se muestre segundo en la lista
  },
  {
    _id: new Types.ObjectId("681224bc8520bbed4685dba1"),
    name: "PS4",
    slug: "playstation4",
    icon: "/images/platforms/ps41.png",
    order: 3, // orden para que se muestre tercero en la lista
  },
  {
    _id: new Types.ObjectId("681224bc8520bbed4685dba2"),
    name: "Xbox",
    slug: "xbox-series-x",
    icon: "/images/platforms/xbox1.png",
    order: 4, // orden para que se muestre cuarto en la lista
  },
  {
    _id: new Types.ObjectId("681224bc8520bbed4685dba3"),
    name: "Nintendo Switch",
    slug: "nintendo-switch",
    icon: "/images/platforms/switch.png",
    order: 5, // orden para que se muestre quinto en la lista
  },
  {
    _id: new Types.ObjectId("681224bc8520bbed4685dba4"),
    name: "Mobile",
    slug: "mobile", // ios y android se transforman en "mobile" en el script
    icon: "/images/platforms/mobile.png",
    order: 6, // orden para que se muestre sexto en la lista
  },
];

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log(" Conectado a MongoDB");

    await Platform.deleteMany();
    console.log(" Todas las plataformas eliminadas");

    await Platform.insertMany(platforms);
    console.log(" Nuevas plataformas insertadas correctamente");

    mongoose.connection.close();
  })
  .catch((error) => {
    console.error(" Error de conexión:", error);
    mongoose.connection.close();
  });
