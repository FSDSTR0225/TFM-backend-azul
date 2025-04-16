const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
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
    steamAppId: {
      type: Number,
    },
  },

  { timestamps: true }
);

const Game = mongoose.model("Game", gameSchema);
module.exports = Game;
