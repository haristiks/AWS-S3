const mongoose = require("mongoose");
const listingSchema = mongoose.Schema(
  {
    title: String,
    imageSrc: [String],
  },
);

module.exports = mongoose.model("Listing", listingSchema);