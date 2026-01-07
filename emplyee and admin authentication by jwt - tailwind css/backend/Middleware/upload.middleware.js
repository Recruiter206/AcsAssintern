
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, './uploads/'),
  filename: (req, file, cb) => {
    // Correctly handles filenames with spaces or special characters
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1 * 1024 * 1024 }, // Still keeping the 1MB safety limit
  fileFilter: (req, file, cb) => {
    // To allow ALL types, we simply accept everything by passing 'true'
    cb(null, true);
  }
});

module.exports = upload;
