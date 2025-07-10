const mongoose = require("mongoose");

const ProfileViewModelSchema = new mongoose.Schema(
  {
    viewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    viewed: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    viewDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);
const ProfileViewModel = mongoose.model("ProfileView", ProfileViewModelSchema);
module.exports = ProfileViewModel;
