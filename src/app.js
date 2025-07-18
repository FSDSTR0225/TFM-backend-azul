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

const allowedOrigins = [
  "http://localhost:5173",
  "https://link2play.netlify.app",
  "https://686ec51a2cfdca916777de77--link2play.netlify.app",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "Authorization",
    ],
  })
);

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
app.use(express.urlencoded({ extended: true }));

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
app.use("/posts", postRoute); // ✅ rutas de post
app.use("/dashboard/widgets", widgetConfigRoute);
app.use("/chats", chatRoute);
app.use("/notifications", notificationRoute);
app.use("/chatbot", chatbotRoute);
app.use("/steam", steamRoute);
app.use("/translate", translateRoute);

module.exports = app;
