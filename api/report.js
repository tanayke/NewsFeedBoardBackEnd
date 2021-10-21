const express = require('express');
const { Op } = require('sequelize');
const { Report, Article } = require('../models');
const { getPagination, getPaginationData } = require('../utils/pagination');

const router = express.Router();

// TODO
// @route GET api/report
// @desc  Get all reports by article.isActive == 0
// @access Public

router.get('/unresolved', async (req, res) => {
  const { page, size } = req.query;
  const { limit, offset } = getPagination(page, size);
  console.log('limit and offset', limit, offset);
  try {
    const reports = await Report.findAndCountAll({
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
      limit,
      offset,
    });
    console.log('reports', reports);
    console.log('getpaginationData', getPaginationData(reports, page, limit));
    return reports.rows
      ? res.status(200).send(getPaginationData(reports, page, limit))
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
    return res.status(400).json(err);
  }
});
module.exports = router;
