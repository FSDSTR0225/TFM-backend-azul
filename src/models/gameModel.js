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
    genres: {
      type: [String],
    },

    platforms: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Platform",
      },
    ],
    rawgId: {
      type: String,
      required: true,
      unique: true,
    },
    screenshots: {
      type: [String],
    },
    tags: {
      type: [String],
    },
    background_image_additional: {
      type: String,
    },
    clip: {
      type: String,
    },
    released: {
      type: String,
    },
    stores: {
      type: [String],
    },
    metacritic: {
      type: Number,
      required: true,
      unique: true,
    },
    lastImportedAt: {
      type: Date,
    },
    developers: {
      type: [String],
    },
    esrbRating: {
      type: String,
    },
  },

  { timestamps: true }
);

const Game = mongoose.model("Game", gameSchema);
module.exports = Game;
