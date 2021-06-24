/* eslint-disable no-nested-ternary */
const express = require('express');
const { Op } = require('sequelize');
const multer = require('multer');
const path = require('path');
const { Article } = require('../models');

const router = express.Router();

const Storage = multer.diskStorage({
  destination: './public/thumbnail',

  // By default, multer removes file extensions so let's add them back
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

router.post('/', upload, async (req, res) => {
  const { title, description, categoryId, reporterId, locationId } = req.body;
  console.log(locationId);
  try {
    const article = await Article.create({
      title,
      description,
      thumbnailImage: `/thumbnail/${req.file.filename}`,
      viewCount: 0,
      uploadDateTime: new Date(),
      isActive: 0,
      category_id: categoryId,
      reporter_id: reporterId,
      location_id: locationId,
    });
    return res.status(201).json(article);
  } catch (err) {
    // console.log(err);
    return res.status(400).json(err.message);
  }
});

// @route GET api/articles
// @desc  gets ALL articles based on filter applied(category,location,search via title) and ALL if no filter is applied
// @access Public
router.get('/', async (req, res) => {
  const { locationId, categoryId } = req.query;

  try {
    const articles =
      locationId && categoryId
        ? await Article.findAll({
            where: {
              [Op.and]: [
                {
                  location_id: locationId,
                },
                {
                  category_id: categoryId,
                },
              ],
            },
            include: ['location', 'reporter', 'category'],
          })
        : locationId
        ? await Article.findAll({
            where: {
              location_id: locationId,
            },
            include: ['location', 'reporter', 'category'],
          })
        : categoryId
        ? await Article.findAll({
            where: {
              category_id: categoryId,
            },
            include: ['location', 'reporter', 'category'],
          })
        : await Article.findAll({
            include: ['location', 'reporter', 'category'],
          });

    return res.json(articles);
  } catch (err) {
    return res.status(400).json(err);
  }
});

// @route GET api/articles
// @desc  gets ALL articles based on SEARCH string (titiel & description)and NONE if no SEARCH string is applied
// @access Public
router.get('/search', async (req, res) => {
  const { search } = req.query;
  if (!search)
    return res.status(400).json({ mesg: 'please dont enter empty string' });
  try {
    const articles = await Article.findAll({
      where: {
        [Op.or]: [
          {
            title: {
              [Op.substring]: search,
            },
          },
          {
            description: {
              [Op.substring]: search,
            },
          },
        ],
      },
      include: ['location', 'reporter', 'category'],
    });
    return res.json(articles);
  } catch (err) {
    return res.status(400).json(err);
  }
});
module.exports = router;
