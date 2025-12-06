const {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent
} = require('../services/event.service');
const { validateEventPayload } = require('../utils/validation');
const { sendSuccess, sendValidationError, sendNotFound, sendServerError, sendNoContent } = require('../utils/response');

// 일정 생성
exports.handleCreateEvent = async (req, res) => {
  try {
    const validationError = validateEventPayload(req.body);
    if (validationError) {
      return sendValidationError(res, validationError);
    }
    const event = await createEvent(req.body);
    return sendSuccess(res, event, 201);
  } catch (error) {
    return sendServerError(res, '일정 생성 중 오류가 발생했습니다.', error);
  }
};

// 일정 목록 조회
exports.handleGetEvents = async (req, res) => {
  try {
    const events = await getEvents(req.query);
    return sendSuccess(res, events);
  } catch (error) {
    return sendServerError(res, '일정 조회 중 오류가 발생했습니다.', error);
  }
};

// 단일 일정 조회
exports.handleGetEventById = async (req, res) => {
  try {
    const event = await getEventById(req.params.id);
    if (!event) {
      return sendNotFound(res, '일정을 찾을 수 없습니다.');
    }
    return sendSuccess(res, event);
  } catch (error) {
    return sendServerError(res, '일정 조회 중 오류가 발생했습니다.', error);
  }
};

// 일정 수정
exports.handleUpdateEvent = async (req, res) => {
  try {
    const validationError = validateEventPayload(req.body);
    if (validationError) {
      return sendValidationError(res, validationError);
    }
    const event = await updateEvent(req.params.id, req.body);
    if (!event) {
      return sendNotFound(res, '일정을 찾을 수 없습니다.');
    }
    return sendSuccess(res, event);
  } catch (error) {
    return sendServerError(res, '일정 수정 중 오류가 발생했습니다.', error);
  }
};

// 일정 삭제
exports.handleDeleteEvent = async (req, res) => {
  try {
    const deleted = await deleteEvent(req.params.id);
    if (!deleted) {
      return sendNotFound(res, '일정을 찾을 수 없습니다.');
    }
    return sendNoContent(res);
  } catch (error) {
    return sendServerError(res, '일정 삭제 중 오류가 발생했습니다.', error);
  }
};

