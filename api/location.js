const express = require('express');
const { Location } = require('../models');

const router = express.Router();

// @route GET api/location
// @desc  get all locations
// @access Public
router.get('/', async (req, res) => {
  const { state } = req.query;
  try {
    // eslint-disable-next-line prettier/prettier
    const locations = state
      ? await Location.findAll({
          where: { state },
        })
      : await Location.findAll();

    return res.json(locations);
  } catch (err) {
    console.log(err);
    return res.status(400).json(err);
  }
});

// router.get('/cities/:state', async (req, res) => {
//   try {
//     const locations = await Location.findAll({
//       where: { state: req.params.state },
//     });
//     return res.json(locations);
//   } catch (err) {
//     console.log(err);
//     return res.status(400).json(err);
//   }
// });
// @route POST api/location
// @desc  create a location
// @access Public
router.post('/', async (req, res) => {
  console.log(req.body);
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
