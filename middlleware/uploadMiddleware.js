const multer = require("multer");
const path = require("path");

const FILE_PATH = path.resolve("../nodejs-homework-rest-api/tmp");
// console.log(FILE_PATH);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, FILE_PATH);
  },
  filename: (req, file, cb) => {
    const [filename, extension] = file.originalname.split(".");
    cb(null, `${filename}.${extension}`);
  },
});

const uploadMiddleware = multer({ storage });

module.exports = { uploadMiddleware };
