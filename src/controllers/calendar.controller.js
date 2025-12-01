const {
  getEventsByMonth,
  getEventsByWeek,
  getEventsByDay,
  getEventsForToday,
  getEventsByRange
} = require('../services/event.service');

// 월 단위 조회 컨트롤러
exports.handleGetMonth = async (req, res) => {
  try {
    const { year, month } = req.query;
    if (!year || !month) {
      return res.status(400).json({ message: 'year와 month는 필수입니다.' });
    }
    const events = await getEventsByMonth(Number(year), Number(month));
    return res.json(events);
  } catch (error) {
    return res.status(500).json({ message: '월간 일정 조회 중 오류가 발생했습니다.', error: error.message });
  }
};

// 주 단위 조회 컨트롤러
exports.handleGetWeek = async (req, res) => {
  try {
    const { year, month, week } = req.query;
    if (!year || !month || !week) {
      return res.status(400).json({ message: 'year, month, week는 필수입니다.' });
    }
    const events = await getEventsByWeek(Number(year), Number(month), Number(week));
    return res.json(events);
  } catch (error) {
    return res.status(500).json({ message: '주간 일정 조회 중 오류가 발생했습니다.', error: error.message });
  }
};

// 일 단위 조회 컨트롤러
exports.handleGetDay = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ message: 'date 쿼리가 필요합니다.' });
    }
    const events = await getEventsByDay(date);
    return res.json(events);
  } catch (error) {
    return res.status(500).json({ message: '일간 일정 조회 중 오류가 발생했습니다.', error: error.message });
  }
};

// 오늘 일정 조회 컨트롤러
exports.handleGetToday = async (_req, res) => {
  try {
    const events = await getEventsForToday();
    return res.json(events);
  } catch (error) {
    return res.status(500).json({ message: '오늘 일정 조회 중 오류가 발생했습니다.', error: error.message });
  }
};

// 기간 조회 컨트롤러
exports.handleGetRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'startDate와 endDate가 필요합니다.' });
    }
    const events = await getEventsByRange(startDate, endDate);
    return res.json(events);
  } catch (error) {
    return res.status(500).json({ message: '기간 일정 조회 중 오류가 발생했습니다.', error: error.message });
  }
};

