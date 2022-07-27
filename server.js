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
    "Access-control-allow-origin": "*",
    "Access-Control-Allow-Credentials": "true",
    "Access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-control-allow-headers": "Content-Type,Authorization,Credentials",
  });

  next();
}
app.use("/auth", auth);
app.use("/crud", crud);

const server = app.listen(process.env.PORT || 3001);
const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "*",
    // credentials: true,
  },
});

async function saveNote(noteData) {
  const newNote = new Notes(noteData);
  const res = await newNote.save();
  console.log("resultSave", res);
}

io.on("connection", (socket) => {
  console.log("User Connected");
  socket.on("sendNote", (noteData) => {
    saveNote(noteData);
    console.log("noteData", noteData);
  });
  socket.on("disconnect", (msg) => {
    console.log("user disonnected", msg);
  });
});
