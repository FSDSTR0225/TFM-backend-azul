require("dotenv").config();
const express = require("express");
const cors = require("cors");

const usersRoute = require("./routes/usersRoute");
const platformsRoute = require("./routes/platformsRoute");
const gamesRoute = require("./routes/gamesRoute");
const profileRoute = require("./routes/profileRoute");
const searchRoute = require("./routes/searchRoute");
const authRoute = require("./routes/authRoute"); // ✅ NUEVO: importar authRoute

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Rutas
app.use("/auth", authRoute); // ✅ NUEVO: montar ruta de login y register
app.use("/users", usersRoute);
app.use("/platforms", platformsRoute);
app.use("/games", gamesRoute);
app.use("/profile", profileRoute);
app.use("/search", searchRoute);

module.exports = app;
