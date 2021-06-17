const express = require('express');

const router = express.Router();

// @route GET api/category
// @desc  test route
// @access Public
router.get('/', (req, res) => res.send('category Router'));

module.exports = router;
