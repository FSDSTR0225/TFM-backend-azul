const express = require("express");
const app = express();
const port = 3000;
const connectDB = require("./src/db");
const cors = require("cors");
const User = require("./src/models/userModel");

app.use(express.json());
connectDB();
app.use(cors());

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
