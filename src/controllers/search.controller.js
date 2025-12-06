const {
  searchEventsByKeyword,
  searchEventsByTitle,
  searchEventsByDate,
  searchEventsByPeriod,
  getRecentEvents
} = require('../services/event.service');
const { validateDateFormat, validateRequiredParams } = require('../utils/validation');
const { sendSuccess, sendValidationError, sendServerError } = require('../utils/response');

// 키워드 검색
exports.handleKeywordSearch = async (req, res) => {
  try {
    const { keyword } = req.query;
    if (!keyword) {
      return sendValidationError(res, 'keyword는 필수입니다.');
    }
    const events = await searchEventsByKeyword(keyword);
    return sendSuccess(res, events);
  } catch (error) {
    return sendServerError(res, '키워드 검색 중 오류가 발생했습니다.', error);
  }
};

// 제목 검색
exports.handleTitleSearch = async (req, res) => {
  try {
    const { title } = req.query;
    if (!title) {
      return sendValidationError(res, 'title은 필수입니다.');
    }
    const events = await searchEventsByTitle(title);
    return sendSuccess(res, events);
  } catch (error) {
    return sendServerError(res, '제목 검색 중 오류가 발생했습니다.', error);
  }
};

// 날짜 검색
exports.handleDateSearch = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) {
      return sendValidationError(res, 'date는 필수입니다.');
    }
    const dateError = validateDateFormat(date);
    if (dateError) {
      return sendValidationError(res, dateError);
    }
    const events = await searchEventsByDate(date);
    return sendSuccess(res, events);
  } catch (error) {
    return sendServerError(res, '날짜 검색 중 오류가 발생했습니다.', error);
  }
};

// 기간 검색
exports.handlePeriodSearch = async (req, res) => {
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
    const events = await searchEventsByPeriod(startDate, endDate);
    return sendSuccess(res, events);
  } catch (error) {
    return sendServerError(res, '기간 검색 중 오류가 발생했습니다.', error);
  }
};

// 최근 일정 조회
exports.handleRecentSearch = async (req, res) => {
  try {
    const limit = req.query.limit ? Number(req.query.limit) : 5;
    const events = await getRecentEvents(limit);
    return sendSuccess(res, events);
  } catch (error) {
    return sendServerError(res, '최근 일정 조회 중 오류가 발생했습니다.', error);
  }
};

