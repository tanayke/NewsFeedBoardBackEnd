const express = require('express');
const { Category, Article, sequelize } = require('../models');

// const auth = require('../middleware/auth');

const router = express.Router();

// @route GET api/articles
// @desc GETs total viewCounts by category
// @access Public
router.get('/views', async (req, res) => {
  try {
    const categoriesViewCountArray = await Article.findAll({
      attributes: [
        [
          sequelize.fn('sum', sequelize.col('viewCount')),
          'categoryTotalViewCount',
        ],
      ],
      group: ['category_id'],
      raw: true,
      order: sequelize.literal('categoryTotalViewCount DESC'),
      include: 'category',
    });
    return categoriesViewCountArray.length
      ? res.status(200).send(categoriesViewCountArray)
      : res.status(204).send('no data found');
  } catch (err) {
    return res.status(204).send(err.message);
  }
});

// @route GET api/category
// @desc  all categories for the home page filter
// @access Public

router.get('/', async (req, res) => {
  try {
    const categories = await Category.findAll();
    return res.json(categories);
  } catch (err) {
    return res.status(400).json(err);
  }
});

// @route POST api/category
// @desc  add a new category while reporting a news article
// @access Reporters only

router.post('/', async (req, res) => {
  const { name } = req.body;

  try {
    const newCategory = await Category.create({
      name,
    });
    return res.status(200).json(newCategory);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});
module.exports = router;
