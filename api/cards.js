const express = require('express');

const router = express.Router();
const { Card } = require('../models');

// @route GET api/cards
// @desc  test route
// @access Public
router.get('/:id', async (req, res) => {
  try {
    const cards = await Card.findAll({
      where: { article_id: req.params.id },
      order: [['cardsOrder', 'ASC']],
    });
    return res.json(cards);
  } catch (err) {
    console.log(err);
    return res.status(400).json(err);
  }
});

module.exports = router;
