const tag = "dbconnect.js";

const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

module.exports = () => {
  function connect() {
    mongoose.set("useCreateIndex", true);
    mongoose
      .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        console.log(tag, "mongodb connected");
      })
      .catch(() => {
        console.log(tag, "mongodb connecting failed");
      });
  }
  connect();
};
