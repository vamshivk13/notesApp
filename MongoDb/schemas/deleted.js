const mongoose = require("mongoose");
const notesSchema = new mongoose.Schema(
  {
    note: String,
    noteTitle: String,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("DeletedNotes", notesSchema);
