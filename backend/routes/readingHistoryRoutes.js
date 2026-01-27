const express = require('express');
const router = express.Router();
const readingHistoryController = require('../controllers/readingHistoryController');

router.get('/user/:userId', readingHistoryController.getUserHistory);
router.post('/', readingHistoryController.updateHistory);

module.exports = router;
