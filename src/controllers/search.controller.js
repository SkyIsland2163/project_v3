const {
  searchEventsByKeyword,
  searchEventsByTitle,
  searchEventsByDate,
  searchEventsByPeriod,
  getRecentEvents
} = require('../services/event.service');

// 키워드 검색 컨트롤러
exports.handleKeywordSearch = async (req, res) => {
  try {
    const { keyword } = req.query;
    if (!keyword) {
      return res.status(400).json({ message: 'keyword 파라미터가 필요합니다.' });
    }
    const events = await searchEventsByKeyword(keyword);
    return res.json(events);
  } catch (error) {
    return res.status(500).json({ message: '키워드 검색 중 오류가 발생했습니다.', error: error.message });
  }
};

// 제목 검색 컨트롤러
exports.handleTitleSearch = async (req, res) => {
  try {
    const { title } = req.query;
    if (!title) {
      return res.status(400).json({ message: 'title 파라미터가 필요합니다.' });
    }
    const events = await searchEventsByTitle(title);
    return res.json(events);
  } catch (error) {
    return res.status(500).json({ message: '제목 검색 중 오류가 발생했습니다.', error: error.message });
  }
};

// 날짜 검색 컨트롤러
exports.handleDateSearch = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ message: 'date 파라미터가 필요합니다.' });
    }
    const events = await searchEventsByDate(date);
    return res.json(events);
  } catch (error) {
    return res.status(500).json({ message: '날짜 검색 중 오류가 발생했습니다.', error: error.message });
  }
};

// 기간 검색 컨트롤러
exports.handlePeriodSearch = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'startDate와 endDate 파라미터가 필요합니다.' });
    }
    const events = await searchEventsByPeriod(startDate, endDate);
    return res.json(events);
  } catch (error) {
    return res.status(500).json({ message: '기간 검색 중 오류가 발생했습니다.', error: error.message });
  }
};

// 최근 일정 조회 컨트롤러
exports.handleRecentSearch = async (req, res) => {
  try {
    const limit = req.query.limit ? Number(req.query.limit) : 5;
    const events = await getRecentEvents(limit);
    return res.json(events);
  } catch (error) {
    return res.status(500).json({ message: '최근 일정 조회 중 오류가 발생했습니다.', error: error.message });
  }
};

