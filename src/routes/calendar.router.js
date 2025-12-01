const express = require('express');
const router = express.Router();
const {
  handleGetMonth,
  handleGetWeek,
  handleGetDay,
  handleGetToday,
  handleGetRange
} = require('../controllers/calendar.controller');

// calendar 라우터: URL → 컨트롤러 매핑
router.get('/month', handleGetMonth);
router.get('/week', handleGetWeek);
router.get('/day', handleGetDay);
router.get('/today', handleGetToday);
router.get('/range', handleGetRange);

module.exports = router;

