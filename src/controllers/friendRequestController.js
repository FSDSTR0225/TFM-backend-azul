const User = require("../models/userModel");
const FriendRequest = require("../models/friendRequestModel");

const createFriendRequest = async (req, res) => {
  const userSender = req.user.id; // Obtenemos el id del usuario que está haciendo la solicitud
  const { userReceiverId, message } = req.body; // Obtenemos el id del receptor y el mensaje de la solicitud

  if (userSender === userReceiverId) {
    // Comprobamos si el emisor es el mismo que el receptor
    return res
      .status(400)
      .json({ error: "No puedes enviarte una solicitud a ti mismo" });
  }

  try {
    const userReceiver = await User.findById(userReceiverId);
    if (!userReceiver) {
      return res.status(404).json({ error: "Usuario receptor no encontrado" });
    }

    // comprobamos si ya existe una solicitud pendiente entre los usuarios tanto por parte del emisor como del receptor
    const existRequest = await FriendRequest.findOne({
      $or: [
        // $or significa que buscamos si existe una solicitud de amistad entre el emisor y el receptor o viceversa
        { userSender: userSender, userReceiver: userReceiverId },
        { userReceiver: userSender, userSender: userReceiverId },
      ], //$in significa que buscamos si existe una solicitud con estatus pendiente o aceptada
      status: { $in: ["pending", "accepted"] }, // Solo buscamos solicitudes pendientes o aceptadas para evitar duplicados,solo se podria enviar solicitud si no hay una pendiente o aceptada
    });

    if (existRequest) {
      return res.status(409).json({
        error:
          "Ya existe una solicitud pendiente o ya eres amigo de este usuario",
      });
    }

    // Creamos la nueva solicitud de amistad
    const newRequest = new FriendRequest({
      userSender,
      userReceiver: userReceiverId,
      message,
    });

    await newRequest.save();

    return res.status(201).json(newRequest);
  } catch (error) {
    console.error("Error al crear la solicitud de amistad:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

const getFriendRequestsReceived = async (req, res) => {
  const userReceiver = req.user.id;

  try {
    const allRequestReceived = await FriendRequest.find({
      userReceiver: userReceiver,
      status: "pending",
    })
      .populate("userSender", "username avatar")
      .sort({ createdAt: -1 }); //lvl mas adelante?añadirlo al populate

    if (allRequestReceived.length === 0) {
      return res.status(200).json([]);
    }

    return res.status(200).json(allRequestReceived);
  } catch (error) {
    console.error(
      "Error al obtener las solicitudes de amistad recibidas:",
      error
    );
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

const getFriendRequestsSent = async (req, res) => {
  const userSender = req.user.id;

  try {
    const allRequestSent = await FriendRequest.find({
      userSender: userSender,
      status: "pending",
    })
      .populate("userReceiver", "username avatar")
      .sort({ createdAt: -1 });

    if (allRequestSent.length === 0) {
      return res.status(200).json([]);
    }

    return res.status(200).json(allRequestSent);
  } catch (error) {
    console.error(
      "Error al obtener las solicitudes de amistad enviadas:",
      error
    );
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

const acceptFriendRequest = async (req, res) => {
  const receiverId = req.user.id;
  const { requestId } = req.params;

  try {
    const findRequest = await FriendRequest.findById(requestId);

    if (!findRequest) {
      return res.status(404).json({ message: "Solicitud no encontrada" });
    }

    if (findRequest.userReceiver.toString() !== receiverId) {
      // Comprobamos si el receptor de la solicitud es el usuario que está intentando aceptarla y si no es así, devolvemos un error 403
      return res
        .status(403)
        .json({ message: "No tienes permiso para aceptar esta solicitud" });
    }

    if (findRequest.status !== "pending") {
      // Comprobamos si la solicitud ya ha sido aceptada o rechazada,es decir, si su estado no es "pending"
      return res
        .status(409)
        .json({ message: "Esta solicitud ya ha sido procesada" });
    }

    findRequest.status = "accepted"; // Cambiamos el estado de la solicitud a "accepted"

    const sender = await User.findById(findRequest.userSender);
    const receiver = await User.findById(findRequest.userReceiver);
    if (!sender || !receiver) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const senderIsFriend = sender.friends.some(
      (friendId) => friendId.toString() === receiver._id.toString()
    );

    const receiverIsFriend = receiver.friends.some(
      (friendId) => friendId.toString() === sender._id.toString()
    );

    if (!senderIsFriend) {
      sender.friends.push({ user: receiver._id });
    }
    if (!receiverIsFriend) {
      receiver.friends.push({ user: sender._id });
    }

    await sender.save();
    await receiver.save();
    await findRequest.save();

    return res
      .status(200)
      .json({ message: "Solicitud aceptada", request: findRequest });
  } catch (error) {
    console.error("Error al aceptar la solicitud de amistad:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

const rejectFriendRequest = async (req, res) => {
  const receiverId = req.user.id;
  const { requestId } = req.params;

  try {
    const findRequest = await FriendRequest.findById(requestId);

    if (!findRequest) {
      return res.status(404).json({ message: "Solicitud no encontrada" });
    }

    if (findRequest.userReceiver.toString() !== receiverId) {
      return res
        .status(403)
        .json({ message: "No tienes permiso para rechazar esta solicitud" });
    }

    if (findRequest.status !== "pending") {
      return res
        .status(409)
        .json({ message: "Esta solicitud ya ha sido procesada" });
    }

    findRequest.status = "rejected";
    await findRequest.save();

    return res
      .status(200)
      .json({ message: "Solicitud rechazada", request: findRequest });
  } catch (error) {
    console.error("Error al rechazar la solicitud de amistad:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

const getFriends = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId).populate(
      "friends.user",
      "username avatar onlineStatus"
    );

    const formattedFriends = user.friends.map((f) => ({
      id: f.user._id,
      username: f.user.username,
      avatarUrl: f.user.avatar,
      onlineStatus: f.user.onlineStatus,
    }));

    return res.json({ friends: formattedFriends });
  } catch (err) {
    return res.status(500).json({ message: "Error al obtener listado amigos" });
  }
};

const deleteFriend = async (req, res) => {
  const userId = req.user.id;
  const { friendId } = req.params;

  try {
    const user = await User.findById(userId);
    const friend = await User.findById(friendId);
    if (!user || !friend) {
      return res.status(404).json({ message: "Usuario o amigo no encontrado" });
    }
    // Comprobamos si el amigo está en la lista de amigos del usuario
    const friendIndex = user.friends.findIndex(
      (f) => f.user.toString() === friendId
    );
    if (friendIndex === -1) {
      return res.status(404).json({ message: "Amigo no encontrado" });
    }
    // Comprobamos si el usuario está en la lista de amigos del amigo
    const userIndex = friend.friends.findIndex(
      (f) => f.user.toString() === userId
    );
    if (userIndex === -1) {
      return res.status(404).json({
        message: "Usuario no encontrado en la lista de amigos del amigo",
      });
    }
    await FriendRequest.findOneAndDelete({
      userSender: userId || friendId, // Buscamos la solicitud de amistad entre el usuario y el amigo
      userReceiver: friendId || userId,
    }); // Buscamos la solicitud de amistad entre el usuario y el friendRequest
    // Eliminamos el amigo de la lista de amigos del usuario
    user.friends.splice(friendIndex, 1);
    // Eliminamos el usuario de la lista de amigos del amigo
    friend.friends.splice(userIndex, 1);
    await user.save();
    await friend.save();
    return res.status(200).json({ message: "Amigo eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar amigo:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

const deleteMyFriendRequest = async (req, res) => {
  const userId = req.user.id;
  const { requestId } = req.params;

  try {
    const request = await FriendRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: "Solicitud no encontrada" });
    }
    if (request.userSender.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "No tienes permiso para eliminar esta solicitud" });
    }
    if (request.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Solo puedes retirar solicitudes pendientes" });
    }
    await FriendRequest.findByIdAndDelete(requestId);
    return res
      .status(200)
      .json({ message: "Solicitud retirada correctamente" });
  } catch (error) {
    console.error("Error al retirar solicitud:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

module.exports = {
  createFriendRequest,
  getFriendRequestsReceived,
  getFriendRequestsSent,
  acceptFriendRequest,
  rejectFriendRequest,
  getFriends,
  deleteFriend,
  deleteMyFriendRequest,
};
