const mongoose = require("mongoose");

const joinEventRequestSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    userRequester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "cancelledByUser"],
      default: "pending",
    },
    message: {
      type: String,
      maxlength: 200,
      required: false,
    },
    archived: {
      type: Boolean,
      default: false, // Indica si la solicitud ha sido archivada al historial una vez gestionada
    },
  },
  { timestamps: true }
);

const JoinEventRequest = mongoose.model(
  "JoinEventRequest",
  joinEventRequestSchema
);
module.exports = JoinEventRequest;
