/**
 * 캘린더 조회 모듈
 * 월별, 주별, 일별, 기간별 일정 조회 기능을 담당합니다.
 */

const { Event } = require('../../database');
const { buildDateRangeWhere } = require('./dateRange');

// 월별 일정 조회
const getEventsByMonth = async (year, month) => {
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0, 23, 59, 59, 999);
  return Event.findAll({
    where: buildDateRangeWhere(start, end),
    order: [['startDateTime', 'ASC']]
  });
};

// 주차별 일정 조회 (1~5주)
const getEventsByWeek = async (year, month, week) => {
  const base = new Date(year, month - 1, 1);
  const start = new Date(base);
  start.setDate(base.getDate() + (week - 1) * 7);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return Event.findAll({
    where: buildDateRangeWhere(start, end),
    order: [['startDateTime', 'ASC']]
  });
};

// 일일 일정 조회
const getEventsByDay = async (dateStr) => {
  const start = new Date(dateStr);
  // UTC 경계를 사용하여 타임존 변경을 방지합니다.
  start.setUTCHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setUTCHours(23, 59, 59, 999);
  return Event.findAll({
    where: buildDateRangeWhere(start, end),
    order: [['startDateTime', 'ASC']]
  });
};

// 오늘 일정 조회
const getEventsForToday = async () => {
  const now = new Date();
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);
  return Event.findAll({
    where: buildDateRangeWhere(start, end),
    order: [['startDateTime', 'ASC']]
  });
};

// 기간별 일정 조회
const getEventsByRange = async (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);
  return Event.findAll({
    where: buildDateRangeWhere(start, end),
    order: [['startDateTime', 'ASC']]
  });
};

module.exports = {
  getEventsByMonth,
  getEventsByWeek,
  getEventsByDay,
  getEventsForToday,
  getEventsByRange
};
