const express = require('express');
const router = express.Router();

// @route GET api/articles
// @desc  test route
// @access Public
router.get('/', (req, res) => res.send('arcticle Router'));

module.exports = router;
