const express = require('express');
const router = express.Router();
const {
  handleKeywordSearch,
  handleTitleSearch,
  handleDateSearch,
  handlePeriodSearch,
  handleRecentSearch
} = require('../controllers/search.controller');

// search 라우터: 검색 전용 API
router.get('/keyword', handleKeywordSearch);
router.get('/name', handleTitleSearch);
router.get('/date', handleDateSearch);
router.get('/period', handlePeriodSearch);
router.get('/recent', handleRecentSearch);

module.exports = router;

