const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
  name: String,
  image: String,
});

module.exports = mongoose.model("User", userSchema);



