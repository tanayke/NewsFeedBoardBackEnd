/* eslint-disable prefer-template */
/* eslint-disable consistent-return */
const express = require('express');

const multer = require('multer');
const path = require('path');
const { Article } = require('../models');

const router = express.Router();
// @route GET api/articles
// @desc  test route
// @access Public

const Storage = multer.diskStorage({
  destination: './public/thumbnail',

  // By default, multer removes file extensions so let's add them back
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + '_' + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: Storage,
}).single('thumbnailImage');

router.get('/', (req, res) => res.send('arcticle Router'));

router.post('/', upload, async (req, res) => {
  const { title, description, categoryId, reporterId, locationId } = req.body;
  const article = new Article({
    title,
    description,
    thumbnailImage: '/thumbnail/' + req.file.filename,
    viewCount: 0,
    uploadDateTime: new Date(),
    isActive: 0,
    category_id: categoryId,
    reporter_id: reporterId,
    location_id: locationId,
  });
  await article.save();
  return res.json({ message: 'article added successfully' });
});

module.exports = router;
