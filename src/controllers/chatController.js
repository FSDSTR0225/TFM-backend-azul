const Chat = require("../models/chatModel");
const Message = require("../models/messageModel");
const User = require("../models/userModel");

const getChatByFriendId = async (req, res) => {
  const userId = req.user.id;
  const friendId = req.params.friendId;

  try {
    // Busca el chat entre ambos
    const chat = await Chat.findOne({
      participants: { $all: [userId, friendId] },
    });

    if (!chat) return res.json([]); // No hay mensajes aún

    // Obtener mensajes del chat y populamos sender y recipient
    const messages = await Message.find({ _id: { $in: chat.messages } })
      .sort({ timestamp: 1 }) // opcional: para que estén en orden
      .populate("sender recipient");

    // Marcamos como leídos los mensajes que eran para el usuario actual y estaban sin leer
    await Message.updateMany(
      {
        _id: { $in: chat.messages },
        recipient: userId,
        read: false,
      },
      { $set: { read: true } }
    );

    res.json(messages);
  } catch (err) {
    console.error("Error al obtener mensajes:", err);
    res.status(500).json({ error: "Error al obtener mensajes" });
  }
};

//TOTAL MENSAJES NO LEÍDOS DEL USUARIO
const getUnreadMessagesCount = async (req, res) => {
  const userId = req.user.id;

  try {
    const totalUnread = await Message.countDocuments({
      recipient: userId,
      read: false,
      type: "chat", // opcional si luego hay foros
    });

    res.json({ totalUnread });
  } catch (error) {
    console.error("Error al contar mensajes no leídos:", error);
    res.status(500).json({ error: "Error al contar mensajes no leídos" });
  }
};

//MENSAJES NO LEÍDOS EN UN CHAT PERSONAL CON UN AMIGO
const getUnreadMessagesPersonalChat = async (req, res) => {
  const userId = req.user.id;
  const friendId = req.params.friendId;

  try {
    const chat = await Chat.findOne({
      participants: { $all: [userId, friendId] },
    });

    if (!chat) return res.json({ unread: 0 });

    const unread = await Message.countDocuments({
      _id: { $in: chat.messages },
      recipient: userId,
      read: false,
    });

    res.json({ unread });
  } catch (error) {
    console.error("Error al contar mensajes no leídos con amigo:", error);
    res.status(500).json({ error: "Error al contar mensajes" });
  }
};

const markMessagesAsRead = async (req, res) => {
  const userId = req.user.id;
  const { chatId } = req.params;

  try {
    // primero verificamos que el chat exista
    const chat = await Chat.findById(chatId);
    if (!chat) return res.status(404).json({ error: "Chat no encontrado" });

    await Message.updateMany(
      // actualizamos los mensajes de ese chat que son del usuario actual y no están leídos a true
      {
        _id: { $in: chat.messages },
        recipient: userId,
        read: false,
      },
      { $set: { read: true } }
    );

    res.json({ success: true });
  } catch (error) {
    console.error("Error al marcar como leídos:", error);
    res.status(500).json({ error: "Error al marcar mensajes" });
  }
};

module.exports = {
  getChatByFriendId,
  getUnreadMessagesCount,
  getUnreadMessagesPersonalChat,
  markMessagesAsRead,
};
