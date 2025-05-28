require("dotenv").config();

const app = require("./src/app");

const connectDB = require("./src/config/db");

const port = process.env.PORT || 3000;

// Conexión a la base de datos
connectDB();

// Servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
