// const {
//   GetObjectCommand,
//   S3Client,
//   PutObjectCommand,
// } = require("@aws-sdk/client-s3");
// const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

// async function getObjectURL(key) {
//   const command = new GetObjectCommand({
//     Bucket: "bgon.ams.dev",
//     Key: key,
//   });
//   const url = getSignedUrl(s3Client, command);
//   return url;
// }

// async function putObject(filename, contentType) {
//   const command = new PutObjectCommand({
//     Bucket: "bgon.ams.dev",
//     Key: `Test/user-uploads/${filename}`,
//     ContentType: contentType,
//   });

//   const url = await getSignedUrl(s3Client, command);
//   return url;
// }

// async function init() {
//   //retriving
//   console.log(
//     "URL for Pexels",
//     await getObjectURL("Test/pexels-nicola-giordano-1101296.jpg")
//   );

//   //uploading
//   console.log(
//     "URL for Uploading",
//     await putObject(`image-${Date.now()}.jpeg`, "image/jpeg")
//   );
// }

// init();
