const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema({
  world: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "World",
    required: true,
  },
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
  },
  type: {
    type: String,
    enum: ["character", "location", "faction", "event", "item", "other"],
    default: "other",
  },
  content: {
    type: String,
    default: "",
  },
  date: {
    type: String,
    default: "",
  },
  tags: {
    type: [String],
    default: [],
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
}, { timestamps: true });

// Text index for searching titles fast (used for auto-linking)
articleSchema.index({ world: 1, title: 1 });

module.exports = mongoose.model("Article", articleSchema);