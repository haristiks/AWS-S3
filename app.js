const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const PORT = 5000;
const router= require('./routers')

mongoose.connect(process.env.MONGO_URL).then(async () => {
  console.log("database connected");
});

const app = express();
app.use(express.json())
app.use('/',router)

app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
  }
  console.log(`Server is Running on PORT: ${PORT}`);
});
