const express = require("express");

const app = express();

var bodyParser = require("body-parser");
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

app.listen(process.env.PORT || 3001);
