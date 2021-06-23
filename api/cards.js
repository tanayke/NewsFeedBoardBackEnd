/* eslint-disable no-const-assign */
/* eslint-disable prefer-template */
const express = require('express');
const multer = require('multer');
const path = require('path');
const { Card } = require('../models');

const router = express.Router();

const Storage = multer.diskStorage({
  destination: './public/cards',

  // By default, multer removes file extensions so let's add them back
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + '_' + Date.now() + path.extname(file.originalname)
      // `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({
  storage: Storage,
}).single('content');

// @route GET api/cards
// @desc  test route
// @access Public
router.get('/', (req, res) => res.send('cards Router'));

router.post('/', upload, async (req, res) => {
  console.log(req.body);
  const { type, content, cardOrder, articleId } = req.body;
  if (type === 'text') {
    const card = new Card({
      type,
      content,
      cardsOrder: cardOrder,
      article_id: articleId,
    });
    await card.save();
  }
  if (type === 'image' || type === 'video') {
    const card = new Card({
      type,
      content: '/cards/' + req.file.filename,
      cardsOrder: cardOrder,
      article_id: articleId,
    });
    await card.save();
  }
  return res.json({ message: 'article added successfully' });
});

module.exports = router;
