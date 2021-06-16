const express = require('express');
const { User, Location } = require('../../models');

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
// @desc  create a user
// @access Public
router.post('/', async (req, res) => {
  const { role, name, email, phone, password, isApproved, location_id } =
    req.body;

  try {
    const user = await User.create({
      role,
      name,
      email,
      phone,
      password,
      isApproved,
      location_id,
    });

    return res.status(200).json(user);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

module.exports = router;
