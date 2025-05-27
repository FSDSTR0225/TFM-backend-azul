require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectDB = require("./src/config/db");
const usersRoute = require("./src/routes/usersRoute");
const platformsRoute = require("./src/routes/platformsRoute");
const gamesRoute = require("./src/routes/gamesRoute");
const profileRoute = require("./src/routes/profileRoute");
const searchRoute = require("./src/routes/searchRoute");
const authRoute = require("./src/routes/authRoute");
const dashboardRoute = require("./src/routes/dashboardRoute");

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Conexión a la base de datos
connectDB();

// Rutas
app.use("/auth", authRoute); //
app.use("/platforms", platformsRoute);
app.use("/games", gamesRoute);
app.use("/profile", profileRoute);
app.use("/search", searchRoute);
app.use("/dashboard", dashboardRoute);

// Servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
