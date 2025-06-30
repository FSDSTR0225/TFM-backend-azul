require("dotenv").config();

const app = require("./src/app");

const connectDB = require("./src/config/db");

const port = process.env.PORT;

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
const Chat = require("./src/models/chatModel");

io.on("connection", (socket) => {
  console.log("Un usuario se ha conectado");

  // Cuando un usuario se conecta, actualizamos su estado a online y guardamos su ID en el socket para usarlo al desconectarse
  socket.on("userConnect", async (userId) => {
    socket.userId = userId; // lo guardamos en el socket para usarlo al desconectarse
    socket.join(userId); // unimos al usuario a una sala privada con su ID de usuario
    if (!userId) return;

    try {
      const user = await User.findByIdAndUpdate(
        userId,
        { onlineStatus: true },
        { new: true, select: "username onlineStatus" } // primero buscamos al usuario por su ID y actualizamos su estado a online,
        // luego le decimos que nos devuelva el usuario actualizado con new: true y que solo queremos el username y onlineStatus.
      );

      console.log(`Usuario ${userId} está en línea`);

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

  //escuchamo el evento "private message" para recibir mensajes privados
  socket.on("private message", async (msg) => {
    //extraemos los datos del mensaje: id del que lo envia, id del destinatario y el contenido del mensaje
    const { senderId, receiverId, content } = msg;
    if (!senderId || !receiverId || !content) return;

    try {
      //buscamos en DB si ya existe un chat entre el remitente y el destinatario

      let chat = await Chat.findOne({
        participants: { $all: [senderId, receiverId] }, // ambos esten en ese chat
      });

      //si no existe, creamos uno nuevo
      if (!chat) {
        chat = new Chat({
          participants: [senderId, receiverId],
          messages: [],
        });
      }

      //Creamos el nuevo mensaje
      const newMessage = {
        sender: senderId,
        recipient: receiverId,
        content,
        timestamp: new Date(),
      };

      //Agregamos el nuevo mensaje al chat y lo guardamos en la base de datos
      chat.messages.push(newMessage);
      await chat.save();

      // Enviamos el mensaje al destinatario
      io.to(receiverId).emit("private message", {
        ...newMessage,
        chatId: chat._id,
      });

      // Tambien se le envia al remitente para que vea el mensaje enviado
      socket.emit("private message", {
        ...newMessage,
        chatId: chat._id,
      });
    } catch (error) {
      console.error("Error al guardar mensaje privado:", error);
    }
  });

  //Desconexion automática
  socket.on("disconnect", async () => {
    const userId = socket.userId;
    if (!userId) return;

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

  //CHAT GLOBAL
  // socket.on("chat message", (msg) => {
  //   io.emit("chat message", msg);
  // });
});

// Conexión a la base de datos
connectDB();

// Servidor
server.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});

module.exports = { app, server, io };
