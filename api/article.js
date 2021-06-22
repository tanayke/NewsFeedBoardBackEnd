const express = require('express');
const formidable = require('formidable');

const router = express.Router();
// @route GET api/articles
// @desc  test route
// @access Public
const multer = require('multer');

router.get('/', (req, res) => res.send('arcticle Router'));

// router.post('/', async (req, res) => {
//   console.log(req.body);
// });

// router.post('/', upload.array('files'), uploadFiles);

router.post('/', (req, res) => {
  const form = formidable({ multiples: true });

  form.parse(req, (err, fields, files) => {
    console.log(fields);
    console.log(files);
  });
});

module.exports = router;
