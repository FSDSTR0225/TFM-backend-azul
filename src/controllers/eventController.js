const Event = require("../models/eventModel");
const JoinEventRequest = require("../models/joinEventRequestModel");
const Notification = require("../models/notificationModel");

const createEvent = async (req, res) => {
  try {
    const {
      title,
      game,
      platform,
      date,
      maxParticipants,
      requiresApproval,
      description,
    } = req.body;

    if (!title || !description || !date || !game || !platform) {
      return res.status(400).json({
        message: "Es necesario completar todos los campos del evento",
      });
    }

    if (description.length > 200) {
      return res.status(400).json({
        message: "La descripción no puede exceder los 200 caracteres",
      });
    }

    // Aquí crea el evento con la data recibida
    const newEvent = await Event.create({
      title,
      game,
      platform,
      date,
      description,
      creator: req.user.id,
      maxParticipants: maxParticipants,
      requiresApproval: requiresApproval,
    });

    const populatedEvent = await Event.findById(newEvent._id) // populamos el evento recién creado para incluir los detalles del juego, plataforma y creador
      .populate("game", "name imageUrl")
      .populate("platform", "name icon")
      .populate("creator", "username avatar");

    const io = req.app.get("io");
    io.emit("newEvent", populatedEvent);

    res
      .status(200)
      .json({ message: "Evento creado con éxito", event: populatedEvent });
  } catch (error) {
    console.error("Error al crear evento:", error);
    return res.status(500).json({ error: error.message, stack: error.stack });
  }
};

const getEvents = async (req, res) => {
  try {
    const dbEvents = await Event.find({ date: { $gte: new Date() } })
      .sort({ date: 1 }) // Obtenemos los eventos que ocurren a partir de hoy, ordenados por fecha ascendente
      .populate("game", "name imageUrl") // obtenemos el nombre del juego y la imagen del juego
      .populate("creator", "username avatar")
      .populate("platform", "name icon");

    const events = dbEvents
      .filter((event) => event.creator)
      .map((event) => {
        return {
          id: event._id.toString(),
          title: event.title,
          game: {
            name: event.game.name,
            imageUrl: event.game.imageUrl, // Incluimos la imagen del juego si está disponible
          },
          platform: {
            name: event.platform.name,
            icon: event.platform.icon,
          },
          date: event.date,
          requiresApproval: event.requiresApproval,
          participants: event.participants.length,
          maxParticipants: event.maxParticipants,
          creator: {
            username: event.creator.username,
            avatar: event.creator.avatar,
          },
        };
      });

    return res.status(200).json({ message: "Listado de eventos", events });
  } catch (error) {
    console.error("Error al obtener listado de eventos", error);
    return res.status(500).json({ error: error.message });
  }
};

const getEventById = async (req, res) => {
  const { eventId } = req.params; // Obtenemos el id del evento de la url
  const userId = req.user.id; // Obtenemos el id del usuario para saber quien esta logueado y accede a ese evento

  try {
    const event = await Event.findById(eventId) // Buscamos el evento por su id y lo llenamos con los datos de la base de datos,hacemos populate de los datos que queremos obtener de la base de datos.
      .populate("game", "name imageUrl") // obtenemos el nombre del juego y la imagen del juego
      .populate("creator", "username avatar")
      .populate("participants", "username avatar")
      .populate("platform", "name icon");
    if (!event) {
      return res.status(404).json({ message: "Evento no encontrado" });
    }

    // comprobamos si la peticion de unirse al evento ya existe, hacemos una busqueda en JoinEventRequest para ver si ya existe una solicitud de unirse al evento,buscamos que cumpla que sea del user logueado y que sea a este evento(Eventid)
    const existingRequest = await JoinEventRequest.findOne({
      $and: [{ userRequester: userId }, { event: eventId }],
    });

    const currentEvent = {
      // al evento le añadimos los datos que queremos devolver al cliente,para mostrarlo en el frontend
      id: event._id.toString(),
      title: event.title,
      description: event.description,
      date: event.date,
      game: {
        name: event.game.name,
        imageUrl: event.game.imageUrl, // Incluimos la imagen del juego si está disponible
      },
      platform: {
        name: event.platform.name,
        icon: event.platform.icon,
      },
      creator: event.creator.username,
      creatorAvatar: event.creator.avatar,
      participants: event.participants.map((part) => ({
        // el array de participantes lo llenamos con los datos que queremos devolver,hacemos un map para recorrer el array de participantes y devolver solo los datos que queremos
        username: part.username,
        avatar: part.avatar,
      })),
      requiresApproval: event.requiresApproval,
      maxParticipants: event.maxParticipants,
      numberParticipants: event.participants.length,
      hasPendingRequest: existingRequest ? true : false, // añadimos el campo hasPendingRequest para saber si el usuario logueado ya ha solicitado unirse al evento, si existe la solicitud, devolvemos true, sino false y asi lo podemos gestionar en el frontend
    };

    return res.status(200).json({
      message: "Evento obtenido correctamente",
      currentEvent,
    });
  } catch (error) {
    console.error("Error al acceder al evento", error);
    return res.status(500).json({ error: error.message });
  }
};

const joinEvent = async (req, res) => {
  const { eventId } = req.params; // Obtenemos el id del evento de la url
  const userId = req.user.id; // Obtenemos el id del usuario de la peticion, ya que lo guardamos en el token al registrarse o iniciar sesion
  try {
    const io = req.app.get("io");

    const event = await Event.findById(eventId); // accedemos al evento por su id

    if (!event) {
      return res.status(404).json({ message: "Evento no encontrado" });
    }

    if (new Date() > event.date) {
      // si la fecha del evento es menor que la fecha actual, significa que el evento ya ha pasado
      return res
        .status(400)
        .json({ message: "Este evento ya no esta disponible" });
    }

    if (event.participants.includes(userId)) {
      // si el usuario ya esta en el evento, no le dejamos unirse de nuevo.
      return res
        .status(409)
        .json({ message: "El usuario ya se encuentra unido a este evento" });
    }

    if (
      event.maxParticipants !== null && // si el maxParticipants no es null,es decir tiene un maximo de participantes y el numero de participantes es igual o mayor que el maximo de participantes,retorna que el evento ha alcanzado el maximo de participantes
      event.participants.length >= event.maxParticipants
    ) {
      return res.status(400).json({
        message: "El evento ha alcanzado el número máximo de participantes",
      });
    }

    if (event.requiresApproval === false) {
      // si el evento no requiere aprobacion, el usuario se une directamente al evento
      event.participants.push(userId); // añadimos el id del usuario al array de participantes del evento
      await event.save(); // guardamos el evento con el nuevo participante

      await Notification.create({
        targetUser: event.creator,
        sender: userId,
        type: "event_joined",
        message: `El usuario ${req.user.username} se ha unido a tu evento "${event.title}"`,
        event: event._id,
      });

      const updatedEvent = await Event.findById(eventId)
        .populate("game", "name imageUrl") // obtenemos el nombre del juego y la imagen del juego
        .populate("creator", "username avatar")
        .populate("participants", "username avatar")
        .populate("platform", "name icon");

      const currentEvent = {
        id: updatedEvent._id.toString(),
        title: updatedEvent.title,
        description: updatedEvent.description,
        date: updatedEvent.date,
        game: {
          name: updatedEvent.game.name,
          imageUrl: updatedEvent.game.imageUrl, // Incluimos la imagen del juego si está disponible
        },
        platform: {
          name: updatedEvent.platform.name,
          icon: updatedEvent.platform.icon,
        },
        creator: updatedEvent.creator.username,
        creatorAvatar: updatedEvent.creator.avatar,
        participants: updatedEvent.participants.map((part) => ({
          username: part.username,
          avatar: part.avatar,
        })),
        requiresApproval: updatedEvent.requiresApproval,
        maxParticipants: updatedEvent.maxParticipants,
        numberParticipants: updatedEvent.participants.length,
      };

      // Evento publico,notificamos al creador del evento que un usuario ha solicitado unirse a su evento

      if (io) {
        const payload = {
          type: "event_joined",
          message: `El usuario ${req.user.username} se ha unido a tu evento "${event.title}"`,
          fromUser: {
            id: userId,
            username: req.user.username,
            avatar: req.user.avatar,
          },
          eventId: event._id,
          date: new Date(),
        };
        console.log("📣 [joinEvent] emitiendo new_notification:", payload);
        io.to(event.creator.toString()).emit("new_notification", payload);
      }
      return res.status(200).json({
        message: `El usuario ${userId} se ha unido al evento`,
        currentEvent,
      });
    } else {
      // si requiere aprobacion,primero comprobamos si ya existe una solicitud de unirse al evento
      const requestExist = await JoinEventRequest.findOne({
        userRequester: userId,
        event: eventId,
        status: "pending",
      });

      if (requestExist) {
        //si la solicitud ya existe, no le dejamos crear otra
        return res.status(400).json({
          message:
            "Ya existe una solicitud para unirte a este evento, por favor, espera respuesta",
        });
      }

      // si no existe la solicitud, la creamos
      const newJoinRequest = await JoinEventRequest.create({
        event: eventId,
        status: "pending",
        userRequester: userId,
      });

      await Notification.create({
        targetUser: event.creator,
        sender: userId,
        type: "event_join_request",
        message: `El usuario "${req.user.username}" ha solicitado unirse a tu evento "${event.title}"`,
        event: event._id,
      });
      if (io) {
        const payload = {
          type: "event_join_request",
          message: `El usuario "${req.user.username}" ha solicitado unirse a tu evento "${event.title}"`,
          fromUser: {
            id: userId,
            username: req.user.username,
            avatar: req.user.avatar,
          },
          eventId: event._id,
          date: new Date(),
        };
        console.log("📣 [joinEvent] emitiendo new_notification:", payload);
        io.to(event.creator.toString()).emit("new_notification", payload);
      }
      return res.status(200).json({
        message: `El usuario "${userId}" ha solicitado unirse al evento`,
        newJoinRequest,
      });
    }
  } catch (error) {
    console.error("Error al unirse al evento", error);
    return res.status(500).json({ error: error.message });
  }
};

const updateEvent = async (req, res) => {
  const { eventId } = req.params;
  const userId = req.user.id; // Obtenemos el id del usuario de la peticion, ya que lo guardamos en el token al registrarse o iniciar sesion

  const {
    id,
    title,
    description,
    date,
    game,
    platform,
    requiresApproval,
    maxParticipants,
    creator,
  } = req.body;

  try {
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: "Evento no encontrado" });
    }

    if (event.creator.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "No tienes permiso para editar este evento" });
    }

    if (title) event.title = title;
    if (description) event.description = description;
    if (date) event.date = date;
    if (game) event.game = game;
    if (platform) event.platform = platform;
    if (typeof requiresApproval !== "undefined")
      // typeof para comprobar si la variable esta definida
      event.requiresApproval = requiresApproval;
    if (typeof maxParticipants !== "undefined") {
      event.maxParticipants = maxParticipants;
    }

    await event.save();

    const populatedEvent = await Event.findById(eventId)
      .populate("game")
      .populate("platform")
      .populate("participants", "username avatar");

    return res.status(200).json({
      message: "Evento actualizado",
      updatedEvent: {
        ...populatedEvent.toObject(),
        id: populatedEvent._id.toString(),
      },
    });
  } catch (error) {
    console.error("Error al editar el evento", error);
    return res.status(500).json({ error: error.message });
  }
};

const deleteEvent = async (req, res) => {
  const { eventId } = req.params;
  const userId = req.user.id;

  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Evento no encontrado" });
    }

    if (event.creator.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "No tienes permiso para eliminar este evento" });
    }

    await Event.findByIdAndDelete(eventId);
    await JoinEventRequest.deleteMany({ event: eventId });
    return res.status(200).json({ message: "Evento eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar el evento", error);
    return res.status(500).json({ error: error.message });
  }
};

const getMyCreatedEvents = async (req, res) => {
  const userId = req.user.id;

  try {
    const myEventsCreated = await Event.find({
      $and: [{ creator: userId }, { date: { $gte: new Date() } }],
    }) // buscamos los eventos creados donde el creador es el usuario logueado
      .sort({ date: -1 }) // ordenamos por fecha de creacion,los mas recientes primero (-1 es orden descendente y ordenamos el campo date)
      .populate({ path: "game", select: "name imageUrl" }) // obtenemos datos del evento y le hacemos populate a game para obtener el nombre del juego
      .populate({ path: "platform", select: "name icon" })
      .populate({ path: "creator", select: "username avatar" });

    if (myEventsCreated.length === 0) {
      return res
        .status(200)
        .json({ message: "No tienes eventos creados en este momento" });
    }
    const eventsFormatted = myEventsCreated.map((event) => ({
      id: event._id.toString(),
      title: event.title,
      date: event.date,
      description: event.description,
      requiresApproval: event.requiresApproval,
      maxParticipants: event.maxParticipants,
      game: {
        name: event.game.name,
        imageUrl: event.game.imageUrl, // Incluimos la imagen del juego si está disponible
      },
      platform: {
        name: event.platform.name,
        icon: event.platform.icon,
      },
      creator: {
        username: event.creator.username,
        avatar: event.creator.avatar,
      },
      participants: event.participants.length,
    }));

    return res.status(200).json({
      total: eventsFormatted.length,
      eventos: eventsFormatted,
    });
  } catch (error) {
    console.error("Error al obtener tus eventos creados", error);
    return res.status(500).json({ error: error.message });
  }
};

const getPastEvents = async (req, res) => {
  const userId = req.user.id;

  try {
    const pastEvents = await Event.find({
      $or: [{ creator: userId }, { participants: userId }],
      date: { $lt: new Date() }, // Filtramos eventos pasados
    })
      .sort({ date: -1 }) // Ordenamos por fecha de forma descendente
      .populate("game", "name imageUrl")
      .populate("platform", "name icon")
      .populate("creator", "username avatar");

    if (pastEvents.length === 0) {
      return res.status(200).json({ total: 0, eventos: [] });
    }

    return res.status(200).json({
      total: pastEvents.length,
      eventos: pastEvents,
    });
  } catch (error) {
    console.error("Error al obtener eventos pasados", error);
    return res.status(500).json({ error: error.message });
  }
};

const getEventsToday = async (req, res) => {
  const userId = req.user.id;

  try {
    const now = new Date(); // Ahora mismo
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999); // Final del día

    const eventsToday = await Event.find({
      date: { $gte: now, $lte: endOfToday },
      $or: [{ creator: userId }, { participants: userId }],
    })
      .populate("game", "name imageUrl") // obtenemos el nombre del juego y la imagen del juego
      .populate("platform", "name icon")
      .populate("creator", "username avatar")
      .sort({ date: 1 });

    if (eventsToday.length === 0) {
      return res.status(200).json({ message: "No hay eventos para hoy" });
    }

    return res.status(200).json({
      total: eventsToday.length,
      events: eventsToday,
    });
  } catch (error) {
    console.error("Error al obtener eventos de hoy", error);
    return res.status(500).json({ error: error.message });
  }
};

const leaveEvent = async (req, res) => {
  const userId = req.user.id;
  const { eventId } = req.params; // Obtenemos el id del evento de la url

  try {
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: "Evento no encontrado" });
    }

    // Verificamos si el usuario está en la lista de participantes,hacemos un some que devuelve true si el usuario está en el array de participantes y comprobamos si el id del usuario coincide con el id del participante
    const isParticipants = event.participants.some(
      (participantId) => participantId.toString() === userId
    );

    if (!isParticipants) {
      return res
        .status(400)
        .json({ message: "No estás participando en este evento" });
    }

    // Eliminamos al usuario del array de participantes,filtramos el array de participantes y devolvemos un nuevo array sin el id del usuario que quiere salir del evento
    event.participants = event.participants.filter(
      (participantId) => participantId.toString() !== userId
    );
    await event.save();

    // marca su solicitud como "cancelada por el usuario"/"cancelledByUser" para el creador del evento lo sepa
    await JoinEventRequest.findOneAndUpdate(
      { userRequester: userId, event: eventId }, // buscamos la solicitud donde el usuario que ha solicitado unirse al evento sea el usuario logueado y buscamos el evento por su id
      { status: "cancelledByUser" }
    );

    return res
      .status(200)
      .json({ message: "Has salido del evento correctamente" });
  } catch (error) {
    console.error("Error al salir del evento:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

const getAllMyEvents = async (req, res) => {
  const userId = req.user.id; // Obtenemos el id del usuario de la peticion, ya que lo guardamos en el token al registrarse o iniciar sesion

  try {
    const myEvents = await Event.find({
      // find devuelve un array de eventos que cumplen con la condicion
      date: { $gte: new Date() }, // Filtramos eventos que ocurren a partir de hoy(evitamos mostrar eventos pasados)
      // $or permite buscar eventos donde el creador sea el usuario logueado o donde el usuario logueado sea un participante
      $or: [{ creator: userId }, { participants: userId }],
    })
      .sort({ date: 1 })
      .populate({ path: "game", select: "name imageUrl" })
      .populate({ path: "platform", select: "name icon" })
      .populate({ path: "creator", select: "username avatar" });

    // OPCION VALIDA TAMBIEN
    // .populate("game", "name")
    // .populate("platform", "name icon")
    // .populate("creator", "username avatar")

    if (!myEvents || myEvents.length === 0) {
      return res.status(200).json({ total: 0, eventos: [] });
    }
    const eventsFormatted = myEvents.map((event) => ({
      id: event._id.toString(),
      title: event.title,
      date: event.date,
      description: event.description,
      requiresApproval: event.requiresApproval,
      maxParticipants: event.maxParticipants,
      game: {
        name: event.game.name,
        imageUrl: event.game.imageUrl, // Incluimos la imagen del juego si está disponible
      },
      platform: {
        name: event.platform.name,
        icon: event.platform.icon,
      },
      creator: {
        username: event.creator.username,
        avatar: event.creator.avatar,
      },
      participants: event.participants.length,
    }));

    return res.status(200).json({
      total: eventsFormatted.length,
      eventos: eventsFormatted,
    });
  } catch (error) {
    console.error("Error al obtener los eventos", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

const getMyJoinedEvents = async (req, res) => {
  const userId = req.user.id;

  try {
    const myEventsJoined = await Event.find({
      $and: [
        //$and indica que se deben cumplir todas las condiciones del array
        { participants: userId }, //condicion 1: el usuario debe estar en el array de participantes
        { creator: { $ne: userId } }, //condicion 2: el usuario NO debe ser el creador del evento ($ne: no igual)
        { date: { $gte: new Date() } }, //condicion 3: el evento debe ocurrir a partir de hoy ($gte: mayor o igual que, new Date() devuelve la fecha actual)
      ],
    })
      .sort({ date: 1 })
      .populate({ path: "game", select: "name imageUrl" })
      .populate({ path: "platform", select: "name icon" })
      .populate({ path: "creator", select: "username avatar" });

    if (!myEventsJoined || myEventsJoined.length === 0) {
      return res.status(200).json({ total: 0, eventos: [] });
    }

    const eventsFormatted = myEventsJoined.map((event) => ({
      id: event._id.toString(),
      title: event.title,
      date: event.date,
      description: event.description,
      requiresApproval: event.requiresApproval,
      maxParticipants: event.maxParticipants,
      game: {
        name: event.game.name,
        imageUrl: event.game.imageUrl, // Incluimos la imagen del juego si está disponible
      },
      platform: {
        name: event.platform.name,
        icon: event.platform.icon,
      },
      creator: {
        username: event.creator.username,
        avatar: event.creator.avatar,
      },
      participants: event.participants.length,
    }));

    return res.status(200).json({
      total: eventsFormatted.length,
      eventos: eventsFormatted,
    });
  } catch (error) {
    console.error("Error al obtener los eventos", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

module.exports = {
  createEvent,
  getEvents,
  getEventById,
  joinEvent,
  updateEvent,
  deleteEvent,
  getMyCreatedEvents,
  getPastEvents,
  getEventsToday,
  leaveEvent,
  getAllMyEvents,
  getMyJoinedEvents,
};
