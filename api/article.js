const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const { body, validationResult } = require('express-validator');

//const auth = require('../middleware/auth');
const { Article } = require('../models');
// @route GET api/articles
// @desc  test route
// @access Public
var Storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + '_' + Date.now() + path.extname(file.originalname)
    );
  },
});

var upload = multer({
  storage: Storage,
}).single('file');

router.get('/', async (req, res) => {
  try {
    const articles = await Article.findAll();
    return res.json(articles);
  } catch (err) {
    console.log(err);
    return res.status(400).json(err);
  }
});
router.post('/', upload, async (req, res) => {
  const {
    title,
    description,
    viewCount,
    uploadDateTime,
    isActive,
    categoryId,
    reporterId,
    locationId,
  } = req.body;
  const thumbnailImage = '/uploads/' + req.file.filename;
  article = new Article({
    title,
    description,
    thumbnailImage,
    viewCount,
    uploadDateTime,
    isActive,
    category_id: categoryId,
    reporter_id: reporterId,
    location_id: locationId,
  });
  await article.save();
  return res.json({ message: 'article added successfully' });
});

module.exports = router;
