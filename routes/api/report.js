const express = require('express');

const router = express.Router();

// @route GET api/report
// @desc  test route
// @access Public
router.get('/', (req, res) => res.send('Report Router'));

module.exports = router;
