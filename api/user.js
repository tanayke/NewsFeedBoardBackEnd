const express = require('express');

const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { jwtSecret, adminEmail } = require('../config/config');
const mailer = require('../mailer');

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

      const adminUser = await User.findOne({ where: { role: 'ADMIN' } });

      await user.save();

      const body1 = `
      <h2 style="color: blue;">Greetings From News Articles APP</h2>
      <p>Hello <strong>${adminUser.name}</strong>, new Reporter has been registered with the system. Please go to following link to Approve Or Deny his Request. Thank You. </p>
      <a href="http://localhost:3000/admin">Click Here</a>

      `;

      if (user.role === 'REPORTER') {
        try {
          mailer.sendEmail(
            adminEmail,
            'New Request For Registration of Reporter',
            body1,
            (error, info) => {
              console.log(error);
              console.log(info);
            }
          );
        } catch (error) {
          console.log(error);
        }
      }

      return res.status(200).json(user);
    } catch (err) {
      console.error(err.message);
      return res.status(500).json(err);
    }
  }
);

module.exports = router;
