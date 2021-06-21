const express = require('express');
const bcrypt = require('bcryptjs');

const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

const { jwtSecret } = require('../config/config');

const router = express.Router();
const auth = require('../middleware/auth');
const { User } = require('../models');

// @route GET api/auth
// @desc  auth route
// @access Publics
router.get('/', auth, async (req, res) => {
  try {
    console.log(`user id ${req.user.id}`);
    //  const user = await User.findOne({ where: { id: req.user.id } });
    const user = await User.findByPk(req.user.id);

    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// @route POST api/auth
// @desc  Authenticate a user & get token
// @access Public
router.post(
  '/',
  [
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Password is required').exists(),
  ],
  // eslint-disable-next-line consistent-return
  async (req, res) => {
    const { email, password } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findOne({ where: { email: req.body.email } });

      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(payload, jwtSecret, { expiresIn: 3600 }, (err, token) => {
        if (err) throw err;
        return res.json({ token });
      });
    } catch (err) {
      console.error(err.message);
      return res.status(500).json(err);
    }
  }
);

module.exports = router;
