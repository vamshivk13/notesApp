const express = require("express");
const notes = require("../MongoDb/schemas/notes");
const router = express.Router();
const Notes = require("../MongoDb/schemas/notes");
router.post("/postNote", async (req, res, next) => {
  try {
    const noteObj = req.body;
    const newNote = new Notes(noteObj);
    const result = await newNote.save();
    res.send({ result });
  } catch (err) {
    res.send(err);
  }
});

router.post("/updateNote", async (req, res, next) => {
  try {
    const noteObj = req.body;

    const result = await Notes.updateOne(
      { _id: noteObj.id },
      { $set: { note: noteObj.note, noteTitle: noteObj.noteTitle } }
    );

    const resp = await Notes.findOne({ _id: noteObj.id });
    console.log("updatedNote", res);
    console.log("noteFormat", noteObj);
    res.send(resp);
  } catch (err) {
    res.send(err);
  }
});

router.post("/getAllNotes", async (req, res, next) => {
  try {
    const result = await Notes.find({ userId: req.body.userId });
    console.log("getAllposts", req.body, result);
    res.send(result);
  } catch (err) {}
});

router.post("/deleteNote", async (req, res, next) => {
  try {
    const noteObj = req.body;
    console.log("delObj", req.body);
    const result = await Notes.deleteOne({ _id: noteObj.id });

    // const resp = await Notes.findOne({ _id: noteObj.id });
    // console.log("updatedNote", res);
    // console.log("noteFormat", noteObj);
    res.send(result);
  } catch (err) {
    res.send(err);
  }
});

module.exports = router;
