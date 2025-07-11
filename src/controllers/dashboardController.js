const FriendRequest = require("../models/friendRequestModel");
const Notification = require("../models/notificationModel");
const Event = require("../models/eventModel");
const JoinEventRequest = require("../models/joinEventRequestModel");
const ProfileViewModel = require("../models/profileViewModel");

const getDailySummary = async (req, res) => {
  const userId = req.user.id;

  try {
    //AMISTADES APROBADAS (ULTIMOS 2 DIAS)
    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000); // Fecha de hace dos días
    const requests = await FriendRequest.find({
      status: "accepted",
      updatedAt: { $gte: twoDaysAgo },
      $or: [{ userReceiver: userId }, { userSender: userId }],
    }) // Buscamos las solicitudes de amistad aprobadas desde hace dos días $gte se usa para mayor o igual que,como hemos definido la fecha de hace dos días, buscamos las solicitudes que se han actualizado desde esa fecha hasta hoy.
      .populate("userSender", "username")
      .populate("userReceiver", "username")
      .sort({ updatedAt: -1 }) //sort para que lo devuelva de mas reciente a menos reciente
      .limit(5);

    const newFriends = requests.map((request) => {
      if (request.userSender._id.toString() === userId.toString()) {
        // si el id del usuario que ha enviado la solicitud es igual a mi id, entonces el receptor es el que ha aceptado la solicitud
        return {
          type: "friend",
          message: `${request.userReceiver.username} ha aceptado tu solicitud de amistad, ¿os echáis una partida?`,
          userId: request.userReceiver._id,
        };
      } else {
        // si el id del usuario que ha enviado la solicitud es diferente a mi id, entonces soy yo el que ha aceptado la solicitud.
        return {
          type: "friend",
          message: `Tienes una nueva amistad con ${request.userSender.username}, ¿os echáis una partida?`,
          userId: request.userSender._id,
        };
      }
    });

    // VISITAS A TU PERFIL (AYER)

    // Obtenemos la fecha de inicio y fin de ayer
    // Para obtener las visitas de ayer, necesitamos establecer el inicio y el fin del día de ayer.
    const startOfYesterday = new Date(); // Obtenemos la fecha actual
    startOfYesterday.setDate(startOfYesterday.getDate() - 1); // Restamos un día para obtener ayer
    startOfYesterday.setHours(0, 0, 0, 0); // Establecemos la hora al inicio del día (00:00:00.000)

    const endOfYesterday = new Date();
    endOfYesterday.setDate(endOfYesterday.getDate() - 1);
    endOfYesterday.setHours(23, 59, 59, 999); // Establecemos la hora al final del día (23:59:59.999) - resto igual

    // buscamos las visitas al perfil del usuario en el modelo ProfileViewModel
    // donde el campo viewed sea igual al userId del usuario que ha iniciado sesión y la fecha de la visita esté entre el inicio y el fin de ayer.
    // Usamos populate para obtener el username y avatar del usuario que ha visto el perfil.
    const profileViews = await ProfileViewModel.find({
      viewed: userId,
      viewDate: { $gte: startOfYesterday, $lte: endOfYesterday },
    }).populate("viewer", "username avatar");

    // Creamos un resumen de las visitas al perfil
    // Si hay visitas, creamos un objeto con el tipo de notificación y el mensaje.
    let profileViewSummary;
    if (profileViews.length > 0) {
      profileViewSummary = {
        type: "profileView",
        message:
          profileViews.length === 1
            ? `👀 Ayer alguien visitó tu perfil`
            : `👀 ${profileViews.length} personas visitaron tu perfil ayer`,
      };
    }
    //EVENTOS MAÑANA
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1); // mañana

    // Creamos copias para no sobrescribir el mismo objeto
    const startOfTomorrow = new Date(tomorrow); // Obtenemos la fecha de mañana
    startOfTomorrow.setHours(0, 0, 0, 0); // Establecemos la hora al inicio del día (00:00:00.000)

    const endOfTomorrow = new Date(tomorrow);
    endOfTomorrow.setHours(23, 59, 59, 999);

    const tomorrowEvents = await Event.find({
      date: { $gte: startOfTomorrow, $lte: endOfTomorrow },
      $or: [{ creator: userId }, { participants: userId }],
    }).sort({ date: 1 });

    // mapeamos los eventos que hemos encontrado para crear el resumen
    //new Date(event.date) nos devuelve la fecha del evento, y usamos toLocaleTimeString para formatear la hora en el formato que queremos
    const tomorrowEventsSummary = tomorrowEvents.map((event) => ({
      type: "eventTomorrow",
      message: `📅 Mañana a las ${new Date(event.date).toLocaleTimeString(
        "es-ES",
        {
          hour: "2-digit",
          minute: "2-digit",
        }
      )} tienes '${event.title}'`,
      eventId: event._id, // Devolvemos el id del evento para que el frontend pueda usarlo si queremos ir a la ficha del evento
    }));

    //EVENTOS PRÓXIMOS (DURANTE ESTA SEMANA)
    const now = new Date(); // Obtenemos la fecha y hora actual
    const endOfWeek = new Date();
    endOfWeek.setDate(now.getDate() + (7 - now.getDay())); // cogemos el dia actual y le hacemos setDate para saber que dia estamos(se haria usando now.getDate()) y le sumamos 7 menos el dia de la semana actual,para que nos devuelva el dia de la semana que es hoy.
    endOfWeek.setHours(23, 59, 59, 999); // Establecemos la hora al final del día

    const events = await Event.find({
      date: { $gte: now, $lte: endOfWeek },
      $or: [{ creator: userId }, { participants: userId }],
    })
      .sort({ date: 1 }) //sort para que lo devuelva de mas reciente a menos reciente
      .limit(3) // Limitamos a 3 eventos
      .select("title date creator")
      .populate("creator", "username"); // Añadimos el populate para que nos devuelva el nombredel creador del evento

    const upcomingEvents = events.map((event) => {
      const date = new Date(event.date);
      const formattedDate = new Intl.DateTimeFormat("es-ES", {
        // Formateamos la fecha y hora de forma que se vea en el formato en el que queremos
        year: "numeric",
        month: "2-digit",
        day: "2-digit",

        hour: "2-digit",
        hour12: false, // Formato de 24 horas
        minute: "2-digit",
      }).format(date);

      const formattedTime = new Intl.DateTimeFormat("es-ES", {
        // Formateamos la hora de forma que se vea en el formato en el que queremos
        hour: "2-digit", // Formato de 2 dígitos para la hora
        hour12: false, // Formato de 24 horas
        minute: "2-digit",
      }).format(date);

      const startOfDay = new Date(date); // Obtenemos la fecha y hora actual
      startOfDay.setHours(0, 0, 0, 0); // Establecemos la hora al inicio del día

      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999); // Establecemos la hora al final del día

      const isToday = event.date >= startOfDay && event.date <= endOfDay; // Comprobamos si la fecha del evento es hoy, sera hoy si la fecha del evento es mayor o igual que la fecha de hoy y menor o igual que la fecha de hoy a las 23:59:59.999

      return {
        type: "event",
        title: event.title,
        date: event.date, // Devolvemos la fecha original para que el frontend pueda usarla si lo necesita
        formattedDate: formattedDate,
        message: isToday
          ? `Hoy tienes el evento '${event.title}' a las ${formattedTime}`
          : `Tienes un evento programado para el ${formattedDate}`,
        eventId: event._id, // Devolvemos el id del evento para que el frontend pueda usarlo si queremos ir a la ficha del evento
      };
    });

    //SE HA CREADO UN EVENTO NUEVO SOBRE NUESTRO JUEGO FAVORITO(DIARIO)

    const user = await User.findById(userId).populate("favoriteGames", "name");

    const favoriteGames = user.favoriteGames;

    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000); // Fecha de ayer
    const newEvents = await Event.find({
      date: { $gte: yesterday }, // buscamos los eventos que se han creado desde ayer
      game: { $in: favoriteGames }, // buscamos los eventos que tienen un juego que esta en nuestros juegos favoritos
      creator: { $ne: userId },
    })
      .populate("game", "name") // hacemos populate del juego para obtener el nombre del juego
      .sort({ createdAt: -1 }) // ordenamos por fecha de creacion, de mas reciente a menos reciente
      .limit(2); // limitamos a 2 eventos

    const eventWithFavoriteGame = newEvents.map((event) => ({
      type: "eventSuggestion",
      message: `🎮 Se ha creado un nuevo evento de ${event.game.name}: '${event.title}'`,
      eventId: event._id,
      gameId: event.game._id,
    }));

    //SOLICITUDES DE UNIÓN DE OTROS USUARIOS A MIS EVENTOS (ULTIMOS 2 DIAS)
    const joinEventReq = await JoinEventRequest.find({
      status: "pending",
      updatedAt: { $gte: twoDaysAgo },
    })
      .populate({
        path: "event", // hacemos populate del evento, ya que el joinEventRequest tiene un campo que hace referencia al evento,path es el nombre del campo que hace referencia al evento
        match: { creator: userId }, // solo queremos los eventos que ha creado el usuario, match es para filtrar los eventos que queremos que nos devuelva (creator === userId)
        select: "title", // seleccionamos los campos que queremos que nos devuelva
      })
      .populate("userRequester", "username avatar")
      .populate({ path: "event", populate: { path: "game", select: "name" } }); // hacemos populate del usuario que ha hecho la solicitud al evento, ya que el joinEventRequest tiene un campo que hace referencia al usuario, y le decimos que solo queremos el username y el avatar

    const acceptedJoinEventReq = await JoinEventRequest.find({
      userRequester: userId,
      status: "accepted",
      updatedAt: { $gte: twoDaysAgo },
    }).populate("event", "title"); // queremos el evento al que se ha unido el usuario, ya que el joinEventRequest tiene un campo que hace referencia al evento, y le decimos que solo queremos el title(ve al modelo event,busca el modelo del id correspondiente y dame el title)

    // Por si el evento fue eliminado o no existe
    const eventValidAccepted = acceptedJoinEventReq.filter((req) => req.event);

    const valid = joinEventReq.filter((req) => req.event); // filtro de seguridad para que solo nos devuelva los joinEventRequest donde el evento existe y cumple la condicion del match, ya que si no seria null y no podriamos acceder a los campos del evento y como ya esta en el array inicial joinEventReq no podemos descartarlo en el populate, asi que lo filtramos aqui.

    const joinEventRequests = valid.map((req) => {
      return {
        type: "joinRequest",
        message: `${req.userRequester.username} quiere unirse a tu evento '${req.event.title}' de ${req.event.game.name}`,
        userId: req.userRequester._id,
        eventId: req.event._id,
        eventTitle: req.event.title,
      };
    });

    //SOLICITUDES DE AMISTAD PENDIENTES (SOY EL RECEPTOR)
    const pendingFriendRequests = await FriendRequest.find({
      status: "pending",
      userReceiver: userId, // Buscamos las solicitudes de amistad pendientes donde el usuario receptor es el usuario que ha iniciado sesión
    }).populate("userSender", "username avatar"); // Hacemos populate del usuario que ha enviado la solicitud para obtener su username y avatar

    const pendingFriendRequestsSummary = {
      type: "friendRequestSummary",
      count: pendingFriendRequests.length,
      message:
        pendingFriendRequests.length === 1
          ? `Tienes 1 solicitud de amistad pendiente de gestionar`
          : `Tienes ${pendingFriendRequests.length} solicitudes de amistad pendientes de gestionar`, // Contamos el número de solicitudes de amistad pendientes
    };

    //SOLO EL Nº TOTAL DE SOLICITUDES PENDIENTES DE UNIRSE A MIS EVENTOS

    let joinRequestSummary;
    if (valid.length > 0) {
      joinRequestSummary = {
        type: "joinRequestSummary",
        message: `Tienes ${valid.length} solicitudes pendientes para tus eventos`,
      };
    }

    //SOLICITUDES DE UNION A EVENTOS QUE ME HAN ACEPTADO Y AHORA ESTOY EN ELLOS
    const acceptedEvent = eventValidAccepted.map((req) => {
      return {
        type: "eventApproval",
        message: `Tu solicitud al evento: '${req.event.title}' ha sido aceptada`,
      };
    });

    //Nº DE NOTIFICACIONES SIN LEER
    const numberOfPendingNotification = await Notification.countDocuments({
      // usamos countDocuments para contar el numero de documentos que cumplen la condicion
      targetUser: userId, // condiciones: notificaciones que son para el usuario y estan pendientes (no leido)
      read: false,
    });

    let notificationSummary; // Inicializamos la variable notificationSummary
    if (numberOfPendingNotification > 0) {
      // Comprobamos si hay notificaciones pendientes,si las hay las mostramos
      notificationSummary = {
        type: "notification",
        message: `Tienes ${numberOfPendingNotification} notificaciones pendientes`,
      };
    }

    return res.status(200).json({
      message: "Resumen diario",
      newFriends,
      upcomingEvents,
      joinEventRequests,
      acceptedEvent,
      notificationSummary: notificationSummary || null, // Si notificationSummary no existe, lo devolvemos como null
      ...(joinRequestSummary && { joinRequestSummary }), // Si joinRequestSummary existe, lo añadimos al objeto de respuesta
      ...(profileViewSummary && { profileViewSummary }), // Si profileViewSummary existe, lo añadimos al objeto de respuesta
      ...(tomorrowEventsSummary.length > 0 && { tomorrowEventsSummary }), // Si eventsTomorrowSummary tiene elementos, lo añadimos al objeto de respuesta
      ...(eventWithFavoriteGame.length > 0 && { eventWithFavoriteGame }), // Si eventWhitFavoriteGame tiene elementos, lo añadimos al objeto de respuesta
      ...(pendingFriendRequests.length > 0 && { pendingFriendRequestsSummary }),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener el resumen diario" });
  }
};

module.exports = {
  getDailySummary,
};
