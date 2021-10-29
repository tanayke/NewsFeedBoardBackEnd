const multer = require('multer');
const path = require('path');

const Storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(
      null,
      file.fieldname === 'thumbnailImage'
        ? './public/thumbnail'
        : './public/cards'
    );
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({
  storage: Storage,
}).any();

module.exports = { upload };
