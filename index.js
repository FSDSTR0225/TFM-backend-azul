const express = require("express");
const app = express();
const port = 3000;
const connectDB = require("./db/connectDB");
const cors = require("cors");

app.use(Express.json());
app.use(cors());

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
