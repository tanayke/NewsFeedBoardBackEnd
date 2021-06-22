const express = require('express');

const router = express.Router();
const { Card } = require('../models');

router.post('/', async (req, res) => {
  const { type, content, articleId } = req.body;
  card = new Card({
    type,
    content,
    cardsOrder,
    article_id: articleId,
  });
  await card.save();
  return res.json({ message: 'card added succesfully' });
});

// @route GET api/cards
// @desc  test route
// @access Public
router.get('/:id', async (req, res) => {
  try {
    const cards = await Card.findAll({ where: { article_id: req.params.id } });
    return res.json(cards);
  } catch (err) {
    console.log(err);
    return res.status(400).json(err);
  }
});

module.exports = router;
