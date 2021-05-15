const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

module.exports = (folder) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(path.dirname(__dirname), 'uploads', folder));
    },
    filename: (req, file, cb) => {
      cb(null, `${uuidv4()}_${file.originalname}`);
    },
  });
  const upload = multer({ storage });
  return upload;
};
