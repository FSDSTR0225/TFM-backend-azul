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
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    message: {
      type: String,
      maxlength: 200,
      required: false,
    },
  },
  { timestamps: true }
);

const JoinEventRequest = mongoose.model(
  "JoinEventRequest",
  joinEventRequestSchema
);
module.exports = JoinEventRequest;
