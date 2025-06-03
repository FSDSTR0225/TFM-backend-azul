const Event = require("../models/eventModel");
const JoinEventRequest = require("../models/joinEventRequestModel");

const getJoinRequests = async (req, res) => {
  const { eventId } = req.params;
  const userId = req.user.id;

  try {
    //buscamos el evento por id
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: "Evento no encontrado" });
    }
    // Comprobamos si el usuario que hace la peticion de las solicitudes es el creador de dichos eventos
    if (event.creator.toString() !== userId) {
      return res.status(403).json({
        message: "No autorizado para ver las solicitudes de este evento",
      });
    }

    const requests = await JoinEventRequest.find({ event: eventId })
      .populate("userRequester", "username avatar")
      .sort({ createdAt: -1 }); // Opcional: ordenar por fecha

    return res.status(200).json({
      message: "Solicitudes obtenidas",
      total: requests.length,
      requests,
    });
  } catch (error) {
    console.error("Error al obtener solicitudes:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

const acceptOrRejectJoinRequest = async (req, res) => {
  const { requestId, response } = req.body; // Obtenemos el id de la solicitud y la respuesta (accept o reject) del cuerpo de la peticion
  const userId = req.user.id; // Obtenemos el id del usuario de la peticion, ya que lo guardamos en el token al registrarse o iniciar sesion

  if (!requestId || !["accept", "reject"].includes(response)) {
    //si no se ha proporcionado el id de la solicitud o la respuesta no es accept o reject, retornamos un error
    return res.status(400).json({ message: "Datos inválidos en la solicitud" });
  }

  try {
    // buscamos la solicitud de unirse al evento por su id y hacemos populate del evento para obtener los datos del evento
    const joinRequest = await JoinEventRequest.findById(requestId)
      .populate("event")
      .populate("userRequester", "username");

    if (!joinRequest) {
      //si no se encuentra la solicitud, retornamos un error
      return res.status(404).json({ message: "Solicitud no encontrada" });
    }

    const event = joinRequest.event; // Obtenemos el evento asociado a la solicitud

    // Solo el creador puede aceptar o rechazar
    if (event.creator.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "No autorizado para gestionar esta solicitud" });
    }

    if (joinRequest.status !== "pending") {
      // Comprobamos si la solicitud ya ha sido gestionada,si no esta en estado pendiente
      return res
        .status(400)
        .json({ message: "La solicitud ya fue gestionada" });
    }

    if (response === "accept") {
      // Comprobamos si no esta lleno el evento antes de aceptar la solicitud
      if (
        event.maxParticipants !== null &&
        event.participants.length >= event.maxParticipants
      ) {
        return res.status(400).json({ message: "El evento ya está lleno" });
      }
      //comprobamos si el usuario ya esta en el evento, si no lo esta, lo añadimos
      if (!event.participants.includes(joinRequest.userRequester.toString())) {
        event.participants.push(joinRequest.userRequester);
      }
      joinRequest.status = "accepted";

      await event.save(); // Guardamos el evento con el nuevo participante
      await joinRequest.save(); // Guardamos la solicitud con el nuevo estado

      return res.status(200).json({
        message: "Usuario aceptado y unido al evento",
        updatedRequest: joinRequest,
        updatedEvent: event,
      });
    } else {
      // Rechazad0
      joinRequest.status = "rejected";
      await joinRequest.save();

      return res
        .status(200)
        .json({ message: "Solicitud rechazada correctamente" });
    }
  } catch (error) {
    console.error("Error al gestionar la solicitud:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

const getMyJoinRequests = async (req, res) => {
  const userId = req.user.id;
  const { archived } = req.query; // Obtenemos el parametro de consulta archived para filtrar las solicitudes archivadas,es decir,ya no pendientes

  try {
    const filter = { userRequester: userId }; // Creamos un filtro para buscar las solicitudes del usuario
    if (archived === "true") {
      // Si el parametro archived es true, buscamos las solicitudes que no estan pendientes
      filter.status = { $in: ["accepted", "rejected"] }; // Filtramos las solicitudes que estan aceptadas o rechazadas,usamos $in para buscar en un array las solicitudes que no estan pendientes.
    } else {
      // Si el parametro archived no es true, buscamos las solicitudes que estan pendientes
      filter.status = "pending"; // Filtramos las solicitudes que estan pendientes
    }
    // Buscamos todas las solicitudes donde el usuario es el solicitante
    const requests = await JoinEventRequest.find(filter)
      .populate({
        // Hacemos populate del evento para obtener los datos del evento
        path: "event",
        select: "title date participants maxParticipants",
        populate: [
          { path: "game", select: "name" },
          { path: "platform", select: "name icon" },
        ],
      })
      .sort({ createdAt: -1 }); // Opcional: ordenar por fecha

    return res.status(200).json({
      message: "Mis solicitudes obtenidas",
      total: requests.length,
      requests,
    });
  } catch (error) {
    console.error("Error al obtener mis solicitudes:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

const deleteMyRequest = async (req, res) => {
  const { requestId } = req.params;
  const userId = req.user.id;

  try {
    const request = await JoinEventRequest.findById(requestId); // Buscamos la solicitud por su id

    if (!request) {
      return res.status(404).json({ message: "Solicitud no encontrada" });
    }

    if (request.userRequester.toString() !== userId) {
      // Comprobamos si el usuario que hace la peticion es el mismo que el usuario registrado en la app
      return res
        .status(403)
        .json({ message: "No autorizado para eliminar esta solicitud" });
    }

    if (request.status !== "pending") {
      //si no esta en estado pendiente, no se puede eliminar
      return res
        .status(400)
        .json({ message: "Solo puedes retirar solicitudes pendientes" });
    }

    await JoinEventRequest.findByIdAndDelete(requestId); // Eliminamos la solicitud de la base de datos

    return res
      .status(200)
      .json({ message: "Solicitud retirada correctamente" });
  } catch (error) {
    console.error("Error al retirar solicitud:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

const getRequestsToMyEvents = async (req, res) => {
  const userId = req.user.id;

  try {
    // Buscamos los eventos creados por el usuario
    const events = await Event.find({ creator: userId }).select("_id");

    if (!events.length) {
      return res.status(404).json({ message: "No tienes eventos creados" });
    }

    // Buscamos las solicitudes de unirse a esos eventos
    const requests = await JoinEventRequest.find({
      event: { $in: events.map((event) => event._id) },
      status: "pending",
    })
      .populate("userRequester", "username avatar")
      .populate("event", "title date participants maxParticipants")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Solicitudes obtenidas",
      total: requests.length,
      requests,
    });
  } catch (error) {
    console.error("Error al obtener solicitudes de mis eventos:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

module.exports = {
  getJoinRequests,
  acceptOrRejectJoinRequest,
  getMyJoinRequests,
  deleteMyRequest,
  getRequestsToMyEvents,
};
