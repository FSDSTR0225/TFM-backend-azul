const FriendsRequest = require("../models/friendsRequestModel");
const Notification = require("../models/notificationModel");
const Event = require("../models/eventModel");
const JoinEventRequest = require("../models/joinEventRequestModel");

const getDailySummary = async (req, res) => {
  const { userId } = req.user;

  try {
    //AMISTADES APROBADAS (ULTIMOS 2 DIAS)
    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000); // Fecha de hace dos días
    const requests = await FriendsRequest.find({
      status: "approved",
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
          message: `${request.userReceiver.username} ha aceptado tu solicitud de amistad`,
          userId: request.userReceiver._id,
        };
      } else {
        // si el id del usuario que ha enviado la solicitud es diferente a mi id, entonces soy yo el que ha aceptado la solicitud.
        return {
          type: "friend",
          message: `Tienes una nueva amistad con ${request.userSender.username}`,
          userId: request.userSender._id,
        };
      }
    });

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

    const approvedJoinEventReq = await JoinEventRequest.find({
      userRequester: userId,
      status: "approved",
      updatedAt: { $gte: twoDaysAgo },
    }).populate("event", "title"); // queremos el evento al que se ha unido el usuario, ya que el joinEventRequest tiene un campo que hace referencia al evento, y le decimos que solo queremos el title(ve al modelo event,busca el modelo del id correspondiente y dame el title)

    // Por si el evento fue eliminado o no existe
    const eventValidApproved = approvedJoinEventReq.filter((req) => req.event);

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

    //SOLO EL Nº TOTAL DE SOLICITUDES PENDIENTES DE UNIRSE A MIS EVENTOS

    let joinRequestSummary;
    if (valid.length > 0) {
      joinRequestSummary = {
        type: "joinRequestSummary",
        message: `Tienes ${valid.length} solicitudes pendientes para tus eventos`,
      };
    }

    //SOLICITUDES DE UNION A EVENTOS QUE ME HAN ACEPTADO Y AHORA ESTOY EN ELLOS
    const approvedEvent = eventValidApproved.map((req) => {
      return {
        type: "eventApproval",
        message: `Has sido aceptado en el evento '${req.event.title}'`,
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
      approvedEvent,
      notificationSummary: notificationSummary || null, // Si notificationSummary no existe, lo devolvemos como null
      ...(joinRequestSummary && { joinRequestSummary }), // Si joinRequestSummary existe, lo añadimos al objeto de respuesta
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener el resumen diario" });
  }
};

module.exports = {
  getDailySummary,
};
