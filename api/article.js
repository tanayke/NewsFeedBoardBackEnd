/* eslint-disable use-isnan */
/* eslint-disable no-const-assign */
/* eslint-disable prefer-template */
/* eslint-disable consistent-return */
const express = require('express');
const { createReadStream } = require('fs');

const multer = require('multer');
const path = require('path');
const { Article } = require('../models');
const { Location } = require('../models');

const router = express.Router();
// @route GET api/articles
// @desc  test route
// @access Public

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
      file.fieldname + '_' + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: Storage,
}).any();

router.get('/', (req, res) => res.send('arcticle Router'));

router.post('/', upload, async (req, res) => {
  console.log(req.body);
  console.log(req.files);
  console.log(req.files.length);

  req.files.forEach((file,i)=>{
     console.log(req.body.card.+i+.type);
     // console.log(req.body.card.+i+.content);
  })

  const {
    title,
    description,
    state,
    city,
    locality,
    categoryId,
    reporterId,
    isNewlocation,
  } = req.body;

  try {
    const location =
      isNewlocation === 'true'
        ? await Location.create({
            locality,
            city,
            state,
          })
        : undefined;

    const article = await Article.create({
      title,
      description,
      thumbnailImage: '/thumbnail/' + req.files[0].filename,
      viewCount: 0,
      uploadDateTime: new Date(),
      isActive: 0,
      category_id: categoryId,
      reporter_id: reporterId,
      location_id: isNewlocation === 'true' ? location.id : locality,
    });
    return res.status(201).json(article);
  } catch (err) {
    console.log(err);
    return res.status(400).json(err);
  }
});

module.exports = router;
