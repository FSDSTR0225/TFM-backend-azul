require("dotenv").config();

const express = require("express");
const app = express();
const port = process.env.PORT;

const connectDB = require("./src/config/db");
const cors = require("cors");
const usersRoute = require("./src/routes/usersRoute");
const platformsRoute = require("./src/routes/platformsRoute");
const gamesRoute = require("./src/routes/gamesRoute");
const profileRoute = require("./src/routes/profileRoute");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
connectDB();
app.use(cors());

app.use("/users", usersRoute);
app.use("/platforms", platformsRoute);
app.use("/games", gamesRoute);
app.use("/profile", profileRoute);

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
