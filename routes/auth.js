const { application } = require("express");
const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const SECRET = "JSONToken123";
const User = require("../MongoDb/schemas/users");
router.post("/registerUser", async (req, res, next) => {
  try {
    const userObj = req.body;
    const newUser = new User(userObj);
    await newUser.save();

    res.send({ userObj });
  } catch (err) {
    res.send(err);
  }
});

function authorize(req, res, next) {
  console.log("headers", req.headers);
  console.log("Header1", req.headers["authorization"]);
  const token = req.headers["authorization"];
  const headerauth = token?.split(" ")[1];
  console.log("HEader", headerauth);

  jwt.verify(headerauth, SECRET, (err, user) => {
    if (err) {
      res.send("error");
    }
    console.log("auth User Data", user);
    req.user = user;
  });
  next();
}

router.get("/authorize", authorize, (req, res) => {
  res.send(req.user);
});

router.post("/loginUser", async (req, res, next) => {
  try {
    console.log("reqBody", req.body);
    const resp = await User.findOne({
      email: req.body.email,
    });

    if (resp.password == req.body.password) {
      const sendData = {
        id: resp._id,
        email: resp.email,
        name: resp.name,
      };
      const token = jwt.sign(sendData, SECRET);
      res.send({ ...sendData, token });
    } else {
      res.status(401).send("user doesnt exist/wrong passcode");
    }
  } catch (err) {
    res.send(err);
  }
});

module.exports = router;
