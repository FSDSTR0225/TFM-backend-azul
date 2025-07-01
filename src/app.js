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
const eventsRoute = require("./routes/eventsRoute");
const joinRequestRoute = require("./routes/joinRequestRoutes");
const widgetConfigRoute = require("./routes/WidgetConfigRoute");
const chatRoute = require("./routes/chatRoute");
const notificationRoute = require("./routes/notificationRoute");

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Para parsear datos de formularios,urlencoded hace falta para que express pueda leer los datos de formularios HTML
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
app.use("/events", eventsRoute);
app.use("/join-request", joinRequestRoute);
app.use("/dashboard/widgets", widgetConfigRoute);
app.use("/chats", chatRoute);
app.use("/notifications", notificationRoute);

module.exports = app;
