const express = require("express");
const app = express();
<<<<<<< HEAD
const port = process.env.PORT;
const connectDB = require("./src/config/db");
const cors = require("cors");
const usersRoute = require("./src/routes/usersRoute");
const platformsRoute = require("./src/routes/platformsRoute");
const gamesRoute = require("./src/routes/gamesRoute");
=======


const connectDB = require("./src/config/db");
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 3000;

const userRoutes = require("./src/routes/userRoutes");

>>>>>>> c6a84587ef5ce5d2b39d6d4d286a8dba2e12d8b0

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
connectDB();
app.use(cors());

<<<<<<< HEAD
app.use("/users", usersRoute);
app.use("/platforms", platformsRoute);
app.use("/games", gamesRoute);
=======
app.use("/users", userRoutes);
>>>>>>> c6a84587ef5ce5d2b39d6d4d286a8dba2e12d8b0

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
