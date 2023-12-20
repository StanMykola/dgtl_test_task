const express = require('express');
const dailyStatsController = require('../controllers/dailyStatsController');

const router = express.Router();

router.route('/daily-stats').get(dailyStatsController.getDailyStatsFromRange);

module.exports = router;
