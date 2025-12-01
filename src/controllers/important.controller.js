const {
  markEventAsImportant,
  unmarkEventAsImportant,
  getImportantEvents,
  getUpcomingImportantEvents,
  updateImportantMemo
} = require('../services/event.service');

// 중요 일정 등록 컨트롤러
exports.handleMarkImportant = async (req, res) => {
  try {
    const event = await markEventAsImportant(req.params.eventId);
    if (!event) {
      return res.status(404).json({ message: '일정을 찾을 수 없습니다.' });
    }
    return res.json(event);
  } catch (error) {
    return res.status(500).json({ message: '중요 일정 설정 중 오류가 발생했습니다.', error: error.message });
  }
};

// 중요 일정 해제 컨트롤러
exports.handleUnmarkImportant = async (req, res) => {
  try {
    const event = await unmarkEventAsImportant(req.params.eventId);
    if (!event) {
      return res.status(404).json({ message: '일정을 찾을 수 없습니다.' });
    }
    return res.json(event);
  } catch (error) {
    return res.status(500).json({ message: '중요 일정 해제 중 오류가 발생했습니다.', error: error.message });
  }
};

// 중요 일정 전체 조회 컨트롤러
exports.handleGetImportantList = async (_req, res) => {
  try {
    const events = await getImportantEvents();
    return res.json(events);
  } catch (error) {
    return res.status(500).json({ message: '중요 일정 조회 중 오류가 발생했습니다.', error: error.message });
  }
};

// 다가오는 중요 일정 조회 컨트롤러
exports.handleGetUpcomingImportant = async (_req, res) => {
  try {
    const events = await getUpcomingImportantEvents();
    return res.json(events);
  } catch (error) {
    return res.status(500).json({ message: '다가오는 중요 일정 조회 중 오류가 발생했습니다.', error: error.message });
  }
};

// 중요 일정 메모 컨트롤러
exports.handleUpdateImportantMemo = async (req, res) => {
  try {
    const { memo } = req.body;
    if (typeof memo !== 'string' || memo.length === 0) {
      return res.status(400).json({ message: 'memo 는 문자열이어야 합니다.' });
    }
    const event = await updateImportantMemo(req.params.eventId, memo);
    if (!event) {
      return res.status(404).json({ message: '일정을 찾을 수 없습니다.' });
    }
    return res.json(event);
  } catch (error) {
    return res.status(500).json({ message: '중요 메모 저장 중 오류가 발생했습니다.', error: error.message });
  }
};

