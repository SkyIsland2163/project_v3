const {
  getEventsByMonth,
  getEventsByWeek,
  getEventsByDay,
  getEventsForToday,
  getEventsByRange
} = require('../services/event.service');
const { validateCalendarParams, validateRequiredParams, validateDateFormat } = require('../utils/validation');
const { sendSuccess, sendValidationError, sendServerError } = require('../utils/response');

// 월간 일정 조회
exports.handleGetMonth = async (req, res) => {
  try {
    const { year, month } = req.query;
    const validationError = validateRequiredParams(req.query, ['year', 'month']);
    if (validationError) {
      return sendValidationError(res, validationError);
    }
    const calendarError = validateCalendarParams(year, month);
    if (calendarError) {
      return sendValidationError(res, calendarError);
    }
    const events = await getEventsByMonth(Number(year), Number(month));
    return sendSuccess(res, events);
  } catch (error) {
    return sendServerError(res, '월간 일정 조회 중 오류가 발생했습니다.', error);
  }
};

// 주간 일정 조회
exports.handleGetWeek = async (req, res) => {
  try {
    const { year, month, week } = req.query;
    const validationError = validateRequiredParams(req.query, ['year', 'month', 'week']);
    if (validationError) {
      return sendValidationError(res, validationError);
    }
    const calendarError = validateCalendarParams(year, month, week);
    if (calendarError) {
      return sendValidationError(res, calendarError);
    }
    const events = await getEventsByWeek(Number(year), Number(month), Number(week));
    return sendSuccess(res, events);
  } catch (error) {
    return sendServerError(res, '주간 일정 조회 중 오류가 발생했습니다.', error);
  }
};

// 일일 일정 조회
exports.handleGetDay = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) {
      return sendValidationError(res, 'date는 필수입니다.');
    }
    const dateError = validateDateFormat(date);
    if (dateError) {
      return sendValidationError(res, dateError);
    }
    const events = await getEventsByDay(date);
    return sendSuccess(res, events);
  } catch (error) {
    return sendServerError(res, '일간 일정 조회 중 오류가 발생했습니다.', error);
  }
};

// 오늘 일정 조회
exports.handleGetToday = async (_req, res) => {
  try {
    const events = await getEventsForToday();
    return sendSuccess(res, events);
  } catch (error) {
    return sendServerError(res, '오늘 일정 조회 중 오류가 발생했습니다.', error);
  }
};

// 기간 일정 조회
exports.handleGetRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const validationError = validateRequiredParams(req.query, ['startDate', 'endDate']);
    if (validationError) {
      return sendValidationError(res, validationError);
    }
    const startDateError = validateDateFormat(startDate);
    if (startDateError) {
      return sendValidationError(res, `startDate: ${startDateError}`);
    }
    const endDateError = validateDateFormat(endDate);
    if (endDateError) {
      return sendValidationError(res, `endDate: ${endDateError}`);
    }
    const events = await getEventsByRange(startDate, endDate);
    return sendSuccess(res, events);
  } catch (error) {
    return sendServerError(res, '기간 일정 조회 중 오류가 발생했습니다.', error);
  }
};

