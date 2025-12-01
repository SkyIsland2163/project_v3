const express = require('express');
const router = express.Router();
const {
  handleCreateEvent,
  handleGetEvents,
  handleGetEventById,
  handleUpdateEvent,
  handleDeleteEvent
} = require('../controllers/events.controller');

// events 라우터: URL과 컨트롤러 매핑
router.post('/', handleCreateEvent);
router.get('/', handleGetEvents);
router.get('/:id', handleGetEventById);
router.put('/:id', handleUpdateEvent);
router.delete('/:id', handleDeleteEvent);

module.exports = router;

