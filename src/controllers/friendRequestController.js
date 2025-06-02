const User = require("../models/userModel");
const FriendRequest = require("../models/friendRequestModel");

const createFriendRequest = async (req, res) => {
  const userSender = req.userId; // Obtenemos el id del usuario que está haciendo la solicitud
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
  const userReceiver = req.userId;

  try {
    const allRequestReceived = await FriendRequest.find({
      userReceiver: req.userId,
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
  const userSender = req.userId;

  try {
    const allRequestSent = await FriendRequest.find({
      userSender: req.userId,
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
  const receiverId = req.userId;
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
      (friend) => friend.user.toString() === receiver._id.toString()
    );
    const receiverIsFriend = receiver.friends.some(
      (friend) => friend.user.toString() === sender._id.toString()
    );

    if (!senderIsFriend) {
      sender.friends.push({ user: receiver._id, status: "accepted" });
    }
    if (!receiverIsFriend) {
      receiver.friends.push({ user: sender._id, status: "accepted" });
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
  const receiverId = req.userId;
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
  try {
    const user = await User.findById(req.userId).populate("friends.user");

    const acceptedFriends = user.friends.filter((f) => f.status === "accepted");

    return res.json({ friends: acceptedFriends });
  } catch (err) {
    return res.status(500).json({ message: "Error al obtener amigos" });
  }
};

module.exports = {
  createFriendRequest,
  getFriendRequestsReceived,
  getFriendRequestsSent,
  acceptFriendRequest,
  rejectFriendRequest,
  getFriends,
};
