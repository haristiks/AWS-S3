const User = require("./models/UserSchema");
const List = require("./models/ListingSchema");
const imageUpload = require("./helpers/imageUpload copy");
const fs = require("fs");

module.exports = {
  createUser: async (req, res) => {
    try {
      const { name } = req.body;
      let userImage;
      let thumb;
      if (req.file) {
        const imgLink = await imageUpload.single(req.file, "image");
        userImage = imgLink.url;
        thumb = imgLink.thumbnailurl;

        fs.unlink(req.file.path, (err) => {
          if (err) {
            console.error("Error deleting file:", err);
          } else {
            console.log("File deleted successfully.");
          }
        });
      }

      const user = await User.create({ name, image: userImage, thumb });
      res.status(201).json({ messege: "user created", user });
    } catch (error) {
      console.log(error);
    }
  },
  createListing: async (req, res) => {
    try {
      const { title } = req.body;
      let imageSrc = [];
      console.log(req.files);
      if (Array.isArray(req.files) && req.files.length > 0) {
        const docsImgLinks = await imageUpload.multiple(req.files, "image");
        docsImgLinks.forEach((item) => imageSrc.push(item.url));
        for (const file of req.files) {
          fs.unlink(req.file, (err) => {
            if (err) {
              console.error("Error deleting file:", err);
            } else {
              console.log("File deleted successfully.");
            }
          });
        }
      }

      const Listing = await List.create({ title, imageSrc });
      res.status(201).json({ messege: "Listing created", Listing });
    } catch (error) {
      console.log(error);
    }
  },
};
