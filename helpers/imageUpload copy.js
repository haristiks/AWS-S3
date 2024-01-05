const { Upload } = require("@aws-sdk/lib-storage");
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const sharp = require("sharp");
const fs = require("fs");

// Loading AWS credentials and S3 configuration from environment variables
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const region = process.env.S3_REGION;
const Bucket = process.env.S3_BUCKET;
const s3BucketPath = process.env.S3_BUCKET_PATH;

// Creating an S3 client using the configured credentials and region
const s3Client = new S3Client({
  region,
  credentials: { accessKeyId, secretAccessKey },
});

module.exports = {
  async single(file, type) {
    try {
      // Compress and convert image  using Sharp
      await sharp(file.path)
        .jpeg({ quality: 30 })
        .toFile("compressed_image.jpeg");

      // Update MIME type for jpeg
      const contentType = "image/jpeg";

      // Create a read stream directly from the path
      const compressedFileStream = fs.createReadStream("compressed_image.jpeg");

      // Initialize an Upload object for handling the S3 upload
      const upload = await new Upload({
        client: s3Client,
        params: {
          Bucket,
          ContentType: contentType,
          Key: s3BucketPath + file.filename,
          Body: compressedFileStream,
        },
      });

      // Upload the file and await completion
      const result = await upload.done();

      // Generate thumbnail before S3 upload
      const thumbnailPath = await sharp("compressed_image.jpeg")
        .resize({ width: 100, height: 100 }) // Adjust dimensions as needed
        .toFormat("jpeg") // Choose desired format
        .toFile("thumbnail.jpeg"); // Temporary filename

      const thumbnailFileStream = fs.createReadStream("thumbnail.jpeg");
      const thumbnailKey =
        s3BucketPath + "thumbnails/" + file.filename + "_thumb.jpg";

      const upload2 = await new Upload({
        client: s3Client,
        params: {
          Bucket,
          ContentType: contentType,
          Key: thumbnailKey,
          Body: thumbnailFileStream,
        },
      });

      const result2 = await upload2.done();

      fs.unlinkSync("compressed_image.jpeg");
      fs.unlinkSync("thumbnail.jpeg");

      const command1 = new GetObjectCommand({
        Bucket: "bgon.ams.dev",
        Key: s3BucketPath + file.filename,
      });

      const command2 = new GetObjectCommand({
        Bucket: "bgon.ams.dev",
        Key: thumbnailKey,
      });

      //geting signed url
      const url = await getSignedUrl(s3Client, command1);
      const thumbnailurl = await getSignedUrl(s3Client, command2);
      return {
        url,
        thumbnailurl,
      };
    } catch (error) {
      console.error("Failed to upload a single file:", error);
    }
  },

  async multiple(files, type) {
    try {
      // Use map to iterate over each file in the specified type key
      const uploadedFilesArr = await Promise.all(
        files.map(async (file) => {
          // Compress and convert image  using Sharp
          await sharp(file.path)
            .jpeg({ quality: 30 })
            .toFile("compressed_image.jpeg");

          // Update MIME type for jpeg
          const contentType = "image/jpeg";

          // Create a read stream directly from the path
          const compressedFileStream = fs.createReadStream(
            "compressed_image.jpeg"
          );
          const upload = await new Upload({
            client: s3Client,
            params: {
              Bucket,
              ContentType: contentType,
              Key: s3BucketPath + file.filename,
              Body: compressedFileStream,
            },
          });

          // Upload the file and await completion
          const result = await upload.done();

          fs.unlinkSync("compressed_image.jpeg");

          const command = new GetObjectCommand({
            Bucket: "bgon.ams.dev",
            Key: s3BucketPath + file.filename,
          });

          //geting signed url
          const url = await getSignedUrl(s3Client, command);

          return {
            url,
            fileName: file.filename,
            originalName: file.originalname,
            size: file.size,
            mimeType: file.mimetype,
          };
        })
      );
      return uploadedFilesArr;
    } catch (error) {
      throw new Error("Failed to upload one of the multiple files:", error);
    }
  },
};
