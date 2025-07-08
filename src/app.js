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
const postRoute = require("./routes/postRoute");
const widgetConfigRoute = require("./routes/widgetConfigRoute");
const chatbotRoute = require("./routes/chatbotRoute");
const chatRoute = require("./routes/chatRoute");
const notificationRoute = require("./routes/notificationRoute");
const steamRoute = require("./routes/steamRoute");

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Para parsear datos de formularios,urlencoded hace falta para que express pueda leer los datos de formularios HTML
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, // puedes quitar esto si NO usas cookies
  })
);

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
app.use("/post", postRoute);
app.use("/dashboard/widgets", widgetConfigRoute);
app.use("/chats", chatRoute);
app.use("/notifications", notificationRoute);
app.use("/chatbot", chatbotRoute);
app.use("/steam", steamRoute);

module.exports = app;
