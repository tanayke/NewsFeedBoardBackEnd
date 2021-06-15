const express = require('express');
const router = express.Router();

// @route GET api/user
// @desc  test route
// @access Public
router.get('/', (req, res) => res.send('User Router'));

module.exports = router;
