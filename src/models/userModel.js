const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    usernameLower: {
      type: String,
      required: false, // Este campo es opcional, diversamente cada modifica del perfil se requiere envirlo en el body
      lowercase: true, // Asegura que el username se guarde en minúsculas en otro campo
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    friends: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        since: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    ratings: [
      {
        event: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Event",
        },
        rating: {
          type: Number,
          required: true,
          min: 1,
          max: 5,
        },
        review: {
          type: String,
          required: true,
        },
      },
    ],
    favoriteGames: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Game",
      },
    ],
    platforms: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Platform",
      },
    ],
    avatar: {
      type: String,
      default: "https://api.dicebear.com/7.x/adventurer/svg?seed=username", //corregir!!! y poner url cloudinary para avatar por defecto
    },
    availability: {
      type: String,
      default: "No disponible",
      enum: ["No disponible", "Mañana", "Tarde", "Noche", "Todo el día"],
    },
    onlineStatus: {
      type: Boolean,
      default: false, // Por defecto, el usuario no está online
    },
    favoriteTags: {
      genres: [
        {
          type: String,
        },
      ],
      modes: [
        {
          type: String,
        },
      ],
      themes: [
        {
          type: String,
        },
      ],
      others: [
        {
          type: String,
        },
      ],
    },
    lastGameSuggestionUpdate: {
      type: Date,
      default: Date.now,
    },
    gameSuggestions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Game" }],
    suggestedUsersLastUpdated: { type: Date, default: null },
    suggestedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    role: {
      type: String,
      enum: ["user", "admin", "bot"],
      default: "user",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
