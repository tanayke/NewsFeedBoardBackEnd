const express = require('express');
const multer = require('multer');

const router = express.Router();
const path = require('path');
const { Article } = require('../models');
// @route GET api/articles
// @desc  test route
// @access Public
const Storage = multer.diskStorage({
  destination: './public/thumbnailImage/',
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({
  storage: Storage,
}).single('thumbnailImage');

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const articles = await Article.findOne({
      where: { id },
      include: ['category', 'user', 'location'],
    });
    console.log(req.params.id);
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
  const thumbnailImage = `/uploads/${req.file.filename}`;
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
