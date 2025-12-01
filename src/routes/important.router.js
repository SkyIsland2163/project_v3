const express = require('express');
const router = express.Router();
const {
  handleMarkImportant,
  handleUnmarkImportant,
  handleGetImportantList,
  handleGetUpcomingImportant,
  handleUpdateImportantMemo
} = require('../controllers/important.controller');

// important 라우터: 주요 일정 관리
router.post('/:eventId', handleMarkImportant);
router.delete('/:eventId', handleUnmarkImportant);
router.get('/', handleGetImportantList);
router.get('/upcoming', handleGetUpcomingImportant);
router.patch('/:eventId/memo', handleUpdateImportantMemo);

module.exports = router;

