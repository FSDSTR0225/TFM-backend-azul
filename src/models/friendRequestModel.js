const mongoose = require("mongoose");

const friendRequestSchema = new mongoose.Schema(
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
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const FriendRequest = mongoose.model("FriendRequest", friendRequestSchema);
module.exports = FriendRequest;
