const mongoose = require("mongoose");

const worldSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "World name is required"],
    trim: true,
    minlength: 2,
  },
  description: {
    type: String,
    default: "",
    trim: true,
  },
  genre: {
    type: String,
    enum: ["fantasy", "sci-fi", "horror", "historical", "modern", "other"],
    default: "fantasy",
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  members: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      role: {
        type: String,
        enum: ["owner", "lore-keeper", "contributor", "reader"],
        default: "contributor",
      },
    },
  ],
  coverColor: {
    type: String,
    default: "#6366f1",
  },
  mapImage: {
    type: String,
    default: "", // URL to a custom map image, optional
  },
  mapPins: [
    {
      label: { type: String, required: true },
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
      article: { type: mongoose.Schema.Types.ObjectId, ref: "Article" }, // optional link
      notes: { type: String, default: "" },
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model("World", worldSchema);