require("dotenv").config();

const app = require("./src/app");

const connectDB = require("./src/config/db");

const port = process.env.PORT || 3000;

const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const express = require("express");
const { disconnect } = require("process");
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("Un usuario se ha conectado");
  socket.on("disconnect", () => {
    console.log("Un usuario se ha desconectado");
  });
  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
  });
});
// Conexión a la base de datos
connectDB();

// Servidor
server.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
