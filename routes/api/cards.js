const express = require('express');

const router = express.Router();

// @route GET api/cards
// @desc  test route
// @access Public
router.get('/', (req, res) => res.send('cards Router'));

module.exports = router;
