const express = require('express');
const { Report } = require('../models');

const router = express.Router();

// @route GET api/report
// @desc  test route
// @access Public
router.post('/', async (req, res) => {
  const { reason, otherReason, userId, articleId } = req.body;

  try {
    const newReport = new Report({
      reason,
      otherReason,
      user_id: userId,
      article_id: articleId,
    });
    await newReport.save();
    return res.status(200).json(newReport);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});
module.exports = router;
