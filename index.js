const express = require("express");
const app = express();


const connectDB = require("./src/config/db");
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 3000;

const userRoutes = require("./src/routes/userRoutes");


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
connectDB();
app.use(cors());

app.use("/users", userRoutes);

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
