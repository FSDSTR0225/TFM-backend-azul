const mongoose = require("mongoose");

const friendsRequestSchema = new mongoose.Schema(
  {
    userSender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userReceiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const FriendsRequest = mongoose.model("FriendsRequest", friendsRequestSchema);
module.exports = FriendsRequest;
