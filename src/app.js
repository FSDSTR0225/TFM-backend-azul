require("dotenv").config();
const express = require("express");
const cors = require("cors");

const usersRoute = require("./routes/usersRoute");
const platformsRoute = require("./routes/platformsRoute");
const gamesRoute = require("./routes/gamesRoute");
const profileRoute = require("./routes/profileRoute");
const searchRoute = require("./routes/searchRoute");
const authRoute = require("./routes/authRoute");
const dashboardRoute = require("./routes/dashboardRoute");
const friendsRoute = require("./routes/friendsRoute");

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Rutas
app.use("/auth", authRoute);
app.use("/users", usersRoute);
app.use("/platforms", platformsRoute);
app.use("/games", gamesRoute);
app.use("/profile", profileRoute);
app.use("/search", searchRoute);
app.use("/dashboard", dashboardRoute);
app.use("/friends", friendsRoute);

module.exports = app;
