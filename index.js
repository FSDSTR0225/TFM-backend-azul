require("dotenv").config();

const express = require("express");
const app = express();

const port = process.env.PORT;
const connectDB = require("./src/config/db");
const cors = require("cors");

app.use(express.json());
connectDB();
app.use(cors());

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
