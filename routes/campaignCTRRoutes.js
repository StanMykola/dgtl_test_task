const express = require('express');
const campaignCTRController = require('../controllers/campaignCTRController');

const router = express.Router();

router.route('/ctr-by-date').get(campaignCTRController.getCampaignCTRsByDate);

module.exports = router;
