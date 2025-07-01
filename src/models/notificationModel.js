const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    targetUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: [
        "friend_request", // alguien te envía solicitud
        "friend_accepted", // alguien acepta tu solicitud
        "friend_rejected", // alguien rechaza tu solicitud
        "event_invitation", // te invitan a evento
        "event_joined", // alguien se une a tu evento
        "event_join_request", // solicitud de unión a evento
        "system", // aviso general, sin usuario.
        "message", // mensaje privado,notificación de mensaje
        "join_request_accepted", // solicitud de unión a evento aceptada
        "join_request_rejected", // solicitud de unión a evento rechazada
        "event_updated", // evento actualizado
        "event_deleted", // evento eliminado
        "event_reminder", // recordatorio de evento
        "friend_online", // notificación de que un amigo está en línea
        "friend_offline", // notificación de que un amigo está fuera de línea
      ],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
      index: true, // Para optimizar las consultas de notificaciones no leídas
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: false,
    },
    metadata: { type: mongoose.Schema.Types.Mixed }, // Para almacenar información adicional si es necesario sin romper la estructura
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);
module.exports = Notification;
