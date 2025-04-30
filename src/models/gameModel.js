const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
    },
    description: {
      type: String,
    },
    genre: {
      type: String,
    },

    platforms: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Platform",
      },
    ],
    rawgId: {
      type: Number,
      required: true,
      unique: true,
    },
  },

  { timestamps: true }
);

const Game = mongoose.model("Game", gameSchema);
module.exports = Game;
