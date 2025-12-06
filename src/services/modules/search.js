/**
 * 검색 모듈
 * 키워드, 제목, 날짜, 기간별 검색 기능을 담당합니다.
 */

const { Op } = require('sequelize');
const { Event } = require('../../database');
const { buildDateRangeWhere } = require('./dateRange');
const { getEventsByDay, getEventsByRange } = require('./calendar');

// 키워드 검색
const searchEventsByKeyword = async (keyword) => {
  const like = `%${keyword}%`;
  return Event.findAll({
    where: {
      [Op.or]: [
        { title: { [Op.like]: like } },
        { description: { [Op.like]: like } }
      ]
    },
    order: [['startDateTime', 'ASC']]
  });
};

// 제목 검색
const searchEventsByTitle = async (title) => {
  const like = `%${title}%`;
  return Event.findAll({
    where: { title: { [Op.like]: like } },
    order: [['startDateTime', 'ASC']]
  });
};

// 날짜 검색
const searchEventsByDate = async (dateStr) => getEventsByDay(dateStr);

// 기간 검색
const searchEventsByPeriod = async (startDate, endDate) =>
  getEventsByRange(startDate, endDate);

// 최근 일정 조회
const getRecentEvents = async (limit = 5) =>
  Event.findAll({
    order: [
      ['createdAt', 'DESC'],
      ['id', 'DESC']
    ],
    limit
  });

module.exports = {
  searchEventsByKeyword,
  searchEventsByTitle,
  searchEventsByDate,
  searchEventsByPeriod,
  getRecentEvents
};
