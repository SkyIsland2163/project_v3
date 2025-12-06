const {
  markEventAsImportant,
  unmarkEventAsImportant,
  getImportantEvents,
  getUpcomingImportantEvents,
  updateImportantMemo
} = require('../services/event.service');
const { sendSuccess, sendValidationError, sendNotFound, sendServerError } = require('../utils/response');

// 중요 일정 등록
exports.handleMarkImportant = async (req, res) => {
  try {
    const event = await markEventAsImportant(req.params.eventId);
    if (!event) {
      return sendNotFound(res, '일정을 찾을 수 없습니다.');
    }
    return sendSuccess(res, event);
  } catch (error) {
    return sendServerError(res, '중요 일정 설정 중 오류가 발생했습니다.', error);
  }
};

// 중요 일정 해제
exports.handleUnmarkImportant = async (req, res) => {
  try {
    const event = await unmarkEventAsImportant(req.params.eventId);
    if (!event) {
      return sendNotFound(res, '일정을 찾을 수 없습니다.');
    }
    return sendSuccess(res, event);
  } catch (error) {
    return sendServerError(res, '중요 일정 해제 중 오류가 발생했습니다.', error);
  }
};

// 중요 일정 전체 조회
exports.handleGetImportantList = async (_req, res) => {
  try {
    const events = await getImportantEvents();
    return sendSuccess(res, events);
  } catch (error) {
    return sendServerError(res, '중요 일정 조회 중 오류가 발생했습니다.', error);
  }
};

// 다가오는 중요 일정 조회
exports.handleGetUpcomingImportant = async (_req, res) => {
  try {
    const events = await getUpcomingImportantEvents();
    return sendSuccess(res, events);
  } catch (error) {
    return sendServerError(res, '다가오는 중요 일정 조회 중 오류가 발생했습니다.', error);
  }
};

// 중요 일정 메모 수정
exports.handleUpdateImportantMemo = async (req, res) => {
  try {
    const { memo } = req.body;
    if (typeof memo !== 'string' || memo.length === 0) {
      return sendValidationError(res, 'memo는 문자열이어야 하며 비워있으면 안 됩니다.');
    }
    const event = await updateImportantMemo(req.params.eventId, memo);
    if (!event) {
      return sendNotFound(res, '일정을 찾을 수 없습니다.');
    }
    return sendSuccess(res, event);
  } catch (error) {
    return sendServerError(res, '중요 메모 저장 중 오류가 발생했습니다.', error);
  }
};

