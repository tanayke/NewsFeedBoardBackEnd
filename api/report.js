const express = require('express');
const { Op } = require('sequelize');
const { Report, Article, User } = require('../models');

const router = express.Router();

// TODO
// @route GET api/report
// @desc  Get all reports by article.isActive == 0
// @access Public

router.get('/unresolved', async (req, res) => {
  try {
    const reports = await Report.findAll({
      include: [
        {
          model: Article,
          as: 'article',
          where: {
            isActive: {
              [Op.eq]: '0',
            },
          },
        },
        'user',
      ],
    });
    return reports.length
      ? res.status(200).send(reports)
      : res.status(204).send('no reports foudn');
  } catch (err) {
    return res.status(204).send(err.message);
  }
});

// @route GET api/report
// @desc  Get a report by userID and articleId to make sure user doesnt report again
// @access Public

router.get('/', async (req, res) => {
  const { articleId, userId } = req.query;
  try {
    const report = await Report.findAll({
      where: {
        article_id: articleId,
        user_id: userId,
      },
    });
    return report.length
      ? res.status(200).send(report)
      : res.status(204).send('no reports foudn');
  } catch (err) {
    return res.status(204).send(err.message);
  }
});

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
    return res.status(201).json(newReport);
  } catch (err) {
    console.log(err);
    return res.status(400).json(err);
  }
});
module.exports = router;
