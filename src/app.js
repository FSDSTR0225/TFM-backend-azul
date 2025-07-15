require("dotenv").config();
const express = require("express");
const cors = require("cors");
const session = require("express-session");

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
const translateRoute = require("./routes/translateRoute");

const app = express();

app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Para parsear datos de formularios,urlencoded hace falta para que express pueda leer los datos de formularios HTML

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://link2play.netlify.app",
      "https://686ec51a2cfdca916777de77--link2play.netlify.app",
    ],
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
app.use("/translate", translateRoute);

module.exports = app;
