const {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent
} = require('../services/event.service');

// 요청 본문 필수값 검증
const validateEventPayload = (body) => {
  const { title, startDateTime, endDateTime } = body;
  if (!title || !startDateTime || !endDateTime) {
    return 'title, startDateTime, endDateTime은 필수입니다.';
  }
  return null;
};

// 일정 생성 컨트롤러
exports.handleCreateEvent = async (req, res) => {
  try {
    const validationError = validateEventPayload(req.body);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }
    const event = await createEvent(req.body);
    return res.status(201).json(event);
  } catch (error) {
    return res.status(500).json({ message: '일정 생성 중 오류가 발생했습니다.', error: error.message });
  }
};

// 일정 목록 조회 컨트롤러
exports.handleGetEvents = async (req, res) => {
  try {
    const events = await getEvents(req.query);
    return res.json(events);
  } catch (error) {
    return res.status(500).json({ message: '일정 조회 중 오류가 발생했습니다.', error: error.message });
  }
};

// 단일 일정 조회 컨트롤러
exports.handleGetEventById = async (req, res) => {
  try {
    const event = await getEventById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: '일정을 찾을 수 없습니다.' });
    }
    return res.json(event);
  } catch (error) {
    return res.status(500).json({ message: '일정 조회 중 오류가 발생했습니다.', error: error.message });
  }
};

// 일정 수정 컨트롤러
exports.handleUpdateEvent = async (req, res) => {
  try {
    const validationError = validateEventPayload(req.body);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }
    const event = await updateEvent(req.params.id, req.body);
    if (!event) {
      return res.status(404).json({ message: '일정을 찾을 수 없습니다.' });
    }
    return res.json(event);
  } catch (error) {
    return res.status(500).json({ message: '일정 수정 중 오류가 발생했습니다.', error: error.message });
  }
};

// 일정 삭제 컨트롤러
exports.handleDeleteEvent = async (req, res) => {
  try {
    const deleted = await deleteEvent(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: '일정을 찾을 수 없습니다.' });
    }
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: '일정 삭제 중 오류가 발생했습니다.', error: error.message });
  }
};

