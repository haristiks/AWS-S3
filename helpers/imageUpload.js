const { Upload } = require("@aws-sdk/lib-storage");
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
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
      // Extract information from the first file in the specified type key
      // const file = files[type][0];
      const fileStream = fs.createReadStream(file.path);

      // Initialize an Upload object for handling the S3 upload
      const upload = await new Upload({
        client: s3Client,
        params: {
          Bucket,
          ContentType: file.mimetype,
          Key: s3BucketPath + file.filename,
          Body: fileStream,
        },
      });

      // Upload the file and await completion
      const result = await upload.done();

      const command = new GetObjectCommand({
        Bucket: "bgon.ams.dev",
        Key: s3BucketPath + file.filename,
      });

      //geting signed url
      const url = await getSignedUrl(s3Client, command);
      return url;
    } catch (error) {
      throw new Error("Failed to upload a single file:", error);
    }
  },

  async multiple(files, type) {
    try {
      // Use map to iterate over each file in the specified type key
      const uploadedFilesArr = await Promise.all(
        files.map(async (file) => {
          const fileStream = fs.createReadStream(file.path);
          const upload = await new Upload({
            client: s3Client,
            params: {
              Bucket,
              ContentType: file.mimetype,
              Key: s3BucketPath + file.filename,
              Body: fileStream,
            },
          });

          // Upload the file and await completion
          const result = await upload.done();

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
