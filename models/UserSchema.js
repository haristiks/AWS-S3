const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
  name: String,
  image: String,
  thumb: String,
});

module.exports = mongoose.model("User", userSchema);
