const mongoose = require("mongoose");

const conversationIaSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // Cada usuario tiene una única conversación con la IA
    },
    messages: [
      {
        role: {
          type: String,
          enum: ["user", "assistant"],
          required: true,
        },
        content: {
          type: String,
          required: true,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

const ConversationIa = mongoose.model("ConversationIa", conversationIaSchema);
module.exports = ConversationIa;
