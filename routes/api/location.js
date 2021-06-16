const express = require('express');
const { Location } = require('../../models');
const router = express.Router();

// @route GET api/location
// @desc  get all locations
// @access Public
router.get('/', (req, res) => res.send('Location Router'));

// @route POST api/location
// @desc  create a location
// @access Public
router.post('/', async (req, res) => {
  const { locality, city, state } = req.body;

  try {
    const location = await Location.create({
      locality,
      city,
      state,
    });
    return res.status(201).json(location);
  } catch (err) {
    console.log(err);
    return res.status(400).json(err);
  }
});

module.exports = router;
