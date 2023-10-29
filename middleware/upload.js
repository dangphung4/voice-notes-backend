const multer = require("multer");

const storage = multer.memoryStorage();
const multerUpload = multer({ storage: storage });

module.exports = multerUpload;
