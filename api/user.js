const express = require('express');

const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/config');

const { User, Location } = require('../models');

const router = express.Router();

// @route GET api/user
// @desc  get all users
// @access Public
router.get('/', async (req, res) => {
  try {
    const users = await User.findAll({ include: 'location' });
    return res.json(users);
  } catch (err) {
    console.log(err);
    return res.status(400).json(err);
  }
});

// @route POST api/user
// @desc  create a user/register user
// @access Public
router.post(
  '/',
  [
    body('name', 'Name is required!').not().isEmpty(),
    body('email', 'Please include a valid email').isEmail(),
    body(
      'password',
      'Please enter a password with minimum 6 characters'
    ).isLength({ min: 6 }),
    body('phone', 'Please enter a valid phone number').isLength({
      min: 10,
      max: 10,
    }),
  ],
  // eslint-disable-next-line consistent-return
  async (req, res) => {
    const {
      role,
      name,
      email,
      phone,
      password,
      isApproved,
      state,
      city,
      locality,
      isNewLocation,
    } = req.body;

    console.log('locality', locality);
    console.log(req.body);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let user = await User.findOne({ where: { email: req.body.email } });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists!' }] });
      }

      const location =
        isNewLocation === 'true'
          ? await Location.create({ state, city, locality })
          : undefined;

      user = new User({
        role,
        name,
        email,
        phone,
        password,
        isApproved,
        location_id: isNewLocation === 'true' ? location.id : locality,
      });

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();

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
