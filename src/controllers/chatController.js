const Chat = require("../models/chatModel");
const User = require("../models/userModel");

const getChatByFriendId = async (req, res) => {
  const userId = req.user.id;
  const friendId = req.params.friendId;

  try {
    const chat = await Chat.findOne({
      participants: { $all: [userId, friendId] }, // Busca un chat donde ambos usuarios son participantes
    }).populate("messages.sender messages.recipient");

    if (!chat) return res.json([]); // No hay mensajes aún

    //busca el chat en el que en el array de participantes esten estos 2 user
    await Chat.updateOne(
      { participants: { $all: [userId, friendId] } },
      { $set: { "messages.$[elem].read": true } }, // $set establece el valor de un campo a lo que se le indique,dentro del array mensajes los que cumplan cierto filtro(arrayFilters) cambialos a true
      {
        arrayFilters: [{ "elem.recipient": userId, "elem.read": false }], // Solo actualiza(aplica el $Set) los mensajes que son para el usuario actual y que no han sido leídos
      }
    );

    res.json(chat.messages);
  } catch (err) {
    console.error("Error al obtener mensajes:", err);
    res.status(500).json({ error: "Error al obtener mensajes" });
  }
};

const getUnreadMessagesCount = async (req, res) => {
  const userId = req.user.id;

  try {
    // Busca todos los chats donde el usuario es destinatario de mensajes no leídos
    const chats = await Chat.find({
      "messages.recipient": userId,
      "messages.read": false,
    });

    let totalUnread = 0; // Contador de mensajes no leídos

    // Recorre los chats y cuenta los mensajes no leídos para el usuario
    chats.forEach((chat) => {
      const count = chat.messages.filter(
        (msg) => !msg.read && msg.recipient.toString() === userId
      ).length;
      totalUnread += count;
    });

    res.json({ totalUnread });
  } catch (error) {
    res.status(500).json({ error: "Error al contar mensajes no leídos" });
  }
};

const getUnreadMessagesPersonalChat = async (req, res) => {
  const userId = req.user.id;
  const friendId = req.params.friendId;

  try {
    //buscamos chat entre el usuario actual y su amigo
    const chat = await Chat.findOne({
      participants: { $all: [userId, friendId] },
    });

    if (!chat) return res.json({ unread: 0 });

    // filtramos los mensajes que son del destinatario actual y que no han sido leídos y los contamos
    const unread = chat.messages.filter(
      (msg) => msg.recipient.toString() === userId && !msg.read
    ).length;

    res.json({ unread });
  } catch (error) {
    console.error("Error al contar mensajes no leídos con amigo:", error);
    res.status(500).json({ error: "Error al contar mensajes" });
  }
};

module.exports = {
  getChatByFriendId,
  getUnreadMessagesCount,
  getUnreadMessagesPersonalChat,
};
