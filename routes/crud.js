const express = require("express");
const notes = require("../MongoDb/schemas/notes");
const router = express.Router();
const Notes = require("../MongoDb/schemas/notes");
const DeletedNotes = require("../MongoDb/schemas/deleted");
router.post("/postNote", async (req, res, next) => {
  try {
    const noteObj = req.body;
    const newNote = new Notes(noteObj);
    const result = await newNote.save();
    res.send({ result });
  } catch (err) {
    res.status(401).send(err);
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
    const result = await Notes.find({ userId: req.body.userId }).sort({
      updatedAt: 1,
    });

    //  console.log("getAllposts", req.body, result);
    res.send(result);
  } catch (err) {}
});

router.post("/deleteNote", async (req, res, next) => {
  try {
    const noteObj = req.body;
    console.log("delObj", req.body);
    const resp = await Notes.findOne({ _id: noteObj.id });
    const newDeleteNote = new DeletedNotes({
      note: resp.note,
      noteTitle: resp.noteTitle,
      userId: resp.userId,
    });
    const respDel = await newDeleteNote.save();
    console.log("DeletedNoteSchema", respDel);
    const result = await Notes.deleteOne({ _id: noteObj.id });

    // const resp = await Notes.findOne({ _id: noteObj.id });
    // console.log("updatedote", res);
    // console.log("noteFormat", noteObj);
    res.send(result);
  } catch (err) {
    res.send(err);
  }
});

router.post("/getTrashNotes", async (req, res, next) => {
  try {
    console.log("Trash", req.body);
    const result = await DeletedNotes.find({ userId: req.body.userId }).sort({
      createdAt: 1,
    });

    //  console.log("getAllposts", req.body, result);
    res.send(result);
  } catch (err) {
    res.status(401).send("error retrieving trash");
  }
});

router.post("/deleteTrashNote", async (req, res, next) => {
  try {
    const noteObj = req.body;
    console.log("delObj", req.body);
    // const resp = await Notes.findOne({ _id: noteObj.id });
    // const newDeleteNote = new DeletedNotes({
    //   note: resp.note,
    //   noteTitle: resp.noteTitle,
    //   userId: resp.userId,
    // });
    // const respDel = await newDeleteNote.save();
    // console.log("DeletedNoteSchema", respDel);
    const result = await DeletedNotes.deleteOne({ _id: noteObj.id });

    // const resp = await Notes.findOne({ _id: noteObj.id });
    // console.log("updatedote", res);
    // console.log("noteFormat", noteObj);
    res.send(result);
  } catch (err) {
    res.send(err);
  }
});

router.post("/restoreTrashNote", async (req, res, next) => {
  try {
    const noteObj = req.body;
    console.log("delObj", req.body);
    const resp = await DeletedNotes.findOne({ _id: noteObj.id });
    const newNote = new Notes({
      note: resp.note,
      noteTitle: resp.noteTitle,
      userId: resp.userId,
    });
    const respnote = await newNote.save();
    // console.log("DeletedNoteSchema", respDel);
    const result = await DeletedNotes.deleteOne({ _id: noteObj.id });

    // const resp = await Notes.findOne({ _id: noteObj.id });
    // console.log("updatedote", res);
    // console.log("noteFormat", noteObj);
    res.send(respnote);
  } catch (err) {
    res.send(err);
  }
});

module.exports = router;
