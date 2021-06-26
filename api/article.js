/* eslint-disable no-nested-ternary */
const express = require('express');
const { Op } = require('sequelize');
const multer = require('multer');
const path = require('path');
const { Article, Card, Location } = require('../models');

const router = express.Router();

const createCards = (cards, articleId, files) => {
  const cardsArray = JSON.parse(cards);
  const cardsArrayUpdated = [];
  let index = 1;
  cardsArray.forEach((card, i) => {
    cardsArrayUpdated.push(card);
    if (card.type === 'IMAGE' || card.type === 'VIDEO') {
      cardsArrayUpdated[i].content = `/cards/${files[index].filename}`;

      index += 1;
    }
    cardsArrayUpdated[i].cardsOrder = i;
    cardsArrayUpdated[i].article_id = articleId;
  });

  return cardsArrayUpdated;
};

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

router.post('/', upload, async (req, res) => {
  const {
    title,
    description,
    state,
    city,
    locality,
    categoryId,
    reporterId,
    isNewlocation,
    cards,
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
      thumbnailImage: `/thumbnail/${req.files[0].filename}`,
      viewCount: 0,
      uploadDateTime: new Date(),
      isActive: 0,
      category_id: categoryId,
      reporter_id: reporterId,
      location_id: isNewlocation === 'true' ? location.id : locality,
    });

    const cardsArray = createCards(cards, article.id, req.files);

    await Card.bulkCreate(cardsArray);

    return res.status(201).json(article);
  } catch (err) {
    console.log(err);
    return res.status(400).json(err);
  }
});

router.get('/:articleId', async (req, res) => {
  try {
    const { articleId } = req.params;
    const articles = await Article.findOne({
      where: { id: articleId },
      include: ['location', 'reporter', 'category'],
    });
    console.log(req.params.id);
    return res.json(articles);
  } catch (err) {
    console.log(err);
    return res.status(400).json(err);
  }
});

// @route GET api/articles
// @desc  gets ALL articles based on filter applied(category,location,search,trending via title) and ALL if no filter is applied
// @access Public
router.get('/', async (req, res) => {
  const { locationId, categoryId, search, isTrending } = req.query;
  let articles;
  try {
    if (search) articles = await fetchArticlesBySearch(search, isTrending);
    else if (locationId && categoryId)
      articles = await fetchArticlesByLocationAndCategory(
        locationId,
        categoryId,
        isTrending
      );
    else if (locationId)
      articles = await fetchArticlesByLocation(locationId, isTrending);
    else if (categoryId)
      articles = await fetchArticlesByCategory(categoryId, isTrending);
    else articles = await fetchAllArticles(isTrending);
    return res.json(articles);
  } catch (err) {
    return res.status(400).json(err);
  }
});

// utitliy methods
const fetchAllArticles = (isTrending) =>
  Article.findAll({
    order: isTrending
      ? [
          ['viewCount', 'DESC'],
          ['uploadDateTime', 'DESC'],
        ]
      : [['uploadDateTime', 'DESC']],
    include: ['location', 'reporter', 'category'],
  });

const fetchArticlesBySearch = (search, isTrending) =>
  Article.findAll({
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
    order: isTrending
      ? [
          ['viewCount', 'DESC'],
          ['uploadDateTime', 'DESC'],
        ]
      : [['uploadDateTime', 'DESC']],
    include: ['location', 'reporter', 'category'],
  });
const fetchArticlesByLocationAndCategory = (
  locationId,
  categoryId,
  isTrending
) =>
  Article.findAll({
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
    order: isTrending
      ? [
          ['viewCount', 'DESC'],
          ['uploadDateTime', 'DESC'],
        ]
      : [['uploadDateTime', 'DESC']],
    include: ['location', 'reporter', 'category'],
  });
const fetchArticlesByLocation = (locationId, isTrending) =>
  Article.findAll({
    where: {
      location_id: locationId,
    },
    order: isTrending
      ? [
          ['viewCount', 'DESC'],
          ['uploadDateTime', 'DESC'],
        ]
      : [['uploadDateTime', 'DESC']],
    include: ['location', 'reporter', 'category'],
  });
const fetchArticlesByCategory = (categoryId, isTrending) =>
  Article.findAll({
    where: {
      category_id: categoryId,
    },
    order: isTrending
      ? [
          ['viewCount', 'DESC'],
          ['uploadDateTime', 'DESC'],
        ]
      : [['uploadDateTime', 'DESC']],
    include: ['location', 'reporter', 'category'],
  });

module.exports = router;
