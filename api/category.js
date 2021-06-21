const express = require('express');
const { Category } = require('../models');

const auth = require('../middleware/auth');

const router = express.Router();

// @route GET api/category
// @desc  all categories for the home page filter
// @access Public

router.get('/', auth, async (req, res) => {
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

router.post('/', auth, async (req, res) => {
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
