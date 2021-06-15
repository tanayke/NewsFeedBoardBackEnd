const express = require('express');
const router = express.Router();

// @route GET api/location
// @desc  test route
// @access Public
router.get('/', (req, res) => res.send('Location Router'));

module.exports = router;
