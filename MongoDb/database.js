const mongoose = require("mongoose");

async function connectDB() {
  try {
    const connectionParams = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
    const dbUrl =
      "mongodb+srv://Vamshi:vk123kar@cluster0.yglo7.mongodb.net/?retryWrites=true&w=majority";
    console.log("URL", process.env.DBURI);
    const conn = await mongoose.connect(dbUrl, connectionParams);
    console.log(conn.connection.host);
  } catch (err) {
    console.log(err);
  }
}

module.exports = connectDB;
