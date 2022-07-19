const mongoose = require("mongoose");
const notesSchema = new mongoose.Schema({
  note: String,
  noteTitle: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Notes", notesSchema);
