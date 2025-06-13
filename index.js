require("dotenv").config();

const app = require("./src/app");

const connectDB = require("./src/config/db");

const port = process.env.PORT || 3000;

const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const User = require("./src/models/userModel");

io.on("connection", (socket) => {
  console.log("Un usuario se ha conectado");

  // Cuando un usuario se conecta, actualizamos su estado a online y guardamos su ID en el socket para usarlo al desconectarse
  socket.on("userConnect", async (userId) => {
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        { onlineStatus: true },
        { new: true, select: "username onlineStatus" }
      ); //buscamos al usuario por su ID y actualizamos su estado a online
      console.log(`Usuario ${userId} está en línea`);
      socket.userId = userId; // lo guardamos en el socket para usarlo al desconectarse
      socket.broadcast.emit("userConnected", {
        message: `Usuario ${user.username} está en línea`,
        userId: user._id,
        onlineStatus: user.onlineStatus,
      }); //emitimos un evento a todos los sockets conectados para informar que un usuario se ha conectado
      socket.emit("userConnected", {
        message: `Usuario ${user.username} está en línea`,
        userId: user._id,
        onlineStatus: user.onlineStatus,
      });
    } catch (error) {
      console.error("Error al actualizar el estado del usuario:", error);
    }
  });

  //Desconexion automática
  socket.on("disconnect", async () => {
    console.log("Un usuario se ha desconectado");

    try {
      //al desconectarse,si el el socket.userId existe cambiamos el estado del usuario a offline
      if (socket.userId) {
        await User.findByIdAndUpdate(socket.userId, { onlineStatus: false });
        console.log(`Usuario ${socket.userId} está offline`);
      }
    } catch (error) {
      console.error("Error al actualizar onlineStatus (desconectado)", error);
    }
  });

  //Desconexión manual
  socket.on("userDisconnected", async (userId) => {
    try {
      await User.findByIdAndUpdate(userId, { onlineStatus: false });
      console.log(`Usuario ${userId} se ha desconectado manualmente`);
    } catch (error) {
      console.error("Error al desconectar manualmente:", error);
    }
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

module.exports = { app, server, io };
