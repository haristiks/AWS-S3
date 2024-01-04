const express = require("express");
const router = express.Router();
const controller = require("./controller");
const { upload } = require("./helpers/multer");

router.post(
  "/user",
  upload.single("image"),
  controller.createUser
);
router.post(
  "/listing",
  upload.array("image", 4),
  controller.createListing
);

module.exports = router;
