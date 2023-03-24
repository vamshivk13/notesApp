const express = require("express");

const app = express();

var bodyParser = require("body-parser");
const Notes = require("./MongoDb/schemas/notes");
require("dotenv").config();
app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());
const auth = require("./routes/auth");
const crud = require("./routes/crud");
const connectDB = require("./MongoDb/database");
connectDB();

app.use(logger);
function logger(req, res, next) {
  res.set({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": "true",
    "Access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-control-allow-headers": "Content-Type,Authorization,Credentials",
  });

  next();
}
app.use("/auth", auth);
app.use("/crud", crud);
app.use("/test", (req, res) => {
  res.send("Hello");
});

//process.env.PORT ||
const server = app.listen(process.env.PORT || 3001);
const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    // credentials: true,
  },
});

async function createNote(noteData) {
  const newNote = new Notes(noteData);
  const res = await newNote.save();
  return res;
}
async function updateNote(noteData) {
  const result = await Notes.updateOne(
    { _id: noteData.id },
    { $set: { note: noteData.note, noteTitle: noteData.noteTitle } }
  );
}
async function deleteNote(noteData) {
  const result = await Notes.deleteOne({ _id: noteData.id });
}
io.on("connection", (socket) => {
  console.log("User Connected");
  socket.on("createNote", async (noteData) => {
    const res = await createNote(noteData);
    console.log("noteData", res);
    io.to(socket.id).emit("noteCreated", res);
    return res;
  });
  socket.on("updateNote", async (noteData) => {
    io.to(socket.id).emit("updateStart", { updated: false });
    const res = await updateNote(noteData);
    io.to(socket.id).emit("updateStart", { updated: true });
  });
  socket.on("deleteNote", async (noteData) => {
    const res = await deleteNote(noteData);
  });
  socket.on("discardIfEmpty", async (noteData) => {
    console.log("discard", noteData);
  });
  socket.on("disconnect", (msg) => {
    console.log("user disonnected", msg);
  });
});
