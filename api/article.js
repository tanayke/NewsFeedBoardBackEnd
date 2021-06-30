/* eslint-disable no-nested-ternary */
const express = require('express');
const { Op } = require('sequelize');
const multer = require('multer');
const path = require('path');
const { Article, Card, Location } = require('../models/index');
const { getPagination, getPaginationData } = require('../utils/pagination');

// utitliy methods

const getWhereClause = (search, locationId, categoryId) => {
  let whereClause = {};
  if (search)
    whereClause = {
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
    };
  else if (locationId && categoryId)
    whereClause = {
      [Op.and]: [
        {
          location_id: locationId,
        },
        {
          category_id: categoryId,
        },
      ],
    };
  else if (locationId)
    whereClause = {
      location_id: locationId,
    };
  else if (categoryId)
    whereClause = {
      category_id: categoryId,
    };
  return whereClause;
};

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
const router = express.Router();

// @route GET api/articles
// @desc  gets ALL articles based on filter applied(category,location,search,trending via title) and ALL if no filter is applied
// @access Public
router.get('/', async (req, res) => {
  const { locationId, categoryId, search, isTrending, page, size } = req.query;
  let articles;
  const { limit, offset } = getPagination(page, size);
  try {
    articles = await Article.findAndCountAll({
      where: {
        ...getWhereClause(search, locationId, categoryId),
        isActive: [0, 1],
      },
      limit,
      offset,
      order: isTrending
        ? [
            ['viewCount', 'DESC'],
            ['uploadDateTime', 'DESC'],
          ]
        : [['uploadDateTime', 'DESC']],
      include: ['location', 'reporter', 'category'],
    });
    return res.status(200).send(getPaginationData(articles, page, limit));
  } catch (error) {
    return res.status(500).res.send(error.response);
  }
});

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
      uploadDateTime: new Date(),
      category_id: categoryId,
      reporter_id: reporterId,
      location_id: isNewlocation === 'true' ? location.id : locality,
    });

    const cardsArray = createCards(cards, article.id, req.files);

    await Card.bulkCreate(cardsArray);

    return res.status(201).json(article);
  } catch (err) {
    return res.status(400).json(err);
  }
});

// @route PATCH api/article
// @desc  update isActive
// @access Public
router.patch('/', async (req, res) => {
  try {
    const { isActive, articleId } = req.body;
    const article = await Article.findByPk(articleId);
    article.isActive = isActive;
    await article.save({ fields: ['isActive'] });
    article.reload();
    return res.status(200).json(article);
  } catch (err) {
    return res.status(400).json(err);
  }
});

// @route GET api/articles
// @desc  GET Article Detials based on articleId
// @access Public
router.get('/:articleId', async (req, res) => {
  try {
    const { articleId } = req.params;
    const articles = await Article.findOne({
      where: { id: articleId },
      include: ['location', 'reporter', 'category'],
    });
    return res.json(articles);
  } catch (err) {
    return res.status(400).json(err);
  }
});

// @route GET api/articles
// @desc increase viewcount of article by 1
// @access Public
router.patch('/viewCount/:articleId', async (req, res) => {
  try {
    const { articleId } = req.params;
    const article = await Article.findByPk(articleId);
    const updatedViewCount = article.increment('viewCount');
    return res.status(200).json(updatedViewCount);
  } catch (err) {
    return res.status(304).send(err);
  }
});

module.exports = router;
