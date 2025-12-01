const { Op } = require('sequelize');
const { Event } = require('../database');

// 공통: ?�짜 범위 ?�터 ?�성
const buildDateRangeWhere = (start, end) => ({
  [Op.or]: [
    {
      startDateTime: {
        [Op.between]: [start, end]
      }
    },
    {
      endDateTime: {
        [Op.between]: [start, end]
      }
    },
    {
      [Op.and]: [
        { startDateTime: { [Op.lte]: start } },
        { endDateTime: { [Op.gte]: end } }
      ]
    }
  ]
});

// ?�정 ?�성
const createEvent = async (payload) => {
  return Event.create(payload);
};

// ?�정 목록 조회 (기간/카테고리 ?�터)
const getEvents = async ({ startDate, endDate, category }) => {
  const where = {};

  if (startDate && endDate) {
    Object.assign(where, buildDateRangeWhere(new Date(startDate), new Date(endDate)));
  } else if (startDate) {
    const start = new Date(startDate);
    const end = new Date(startDate);
    end.setHours(23, 59, 59, 999);
    Object.assign(where, buildDateRangeWhere(start, end));
  }

  if (category) {
    where.category = category;
  }

  return Event.findAll({ where, order: [['startDateTime', 'ASC']] });
};

// ?�일 ?�정 조회
const getEventById = async (id) => Event.findByPk(id);

// ?�정 ?�정
const updateEvent = async (id, payload) => {
  const event = await Event.findByPk(id);
  if (!event) return null;
  return event.update(payload);
};

// ?�정 ??��
const deleteEvent = async (id) => {
  const event = await Event.findByPk(id);
  if (!event) return null;
  await event.destroy();
  return true;
};

// ???�위 조회
const getEventsByMonth = async (year, month) => {
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0, 23, 59, 59, 999);
  return Event.findAll({
    where: buildDateRangeWhere(start, end),
    order: [['startDateTime', 'ASC']]
  });
};

// 주차 계산 (1??기�?)
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

// ???�위 조회
const getEventsByDay = async (dateStr) => {
  const start = new Date(dateStr);
  // Use UTC boundaries to avoid timezone shifts when the input is a date-only string
  start.setUTCHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setUTCHours(23, 59, 59, 999);
  return Event.findAll({
    where: buildDateRangeWhere(start, end),
    order: [['startDateTime', 'ASC']]
  });
};

// ?�늘 ?�정
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

// ?�의 기간 조회
const getEventsByRange = async (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);
  return Event.findAll({
    where: buildDateRangeWhere(start, end),
    order: [['startDateTime', 'ASC']]
  });
};

// 중요 ?�정 ?�정
const markEventAsImportant = async (eventId) => {
  const event = await Event.findByPk(eventId);
  if (!event) return null;
  event.isImportant = true;
  return event.save();
};

// 중요 ?�정 ?�제
const unmarkEventAsImportant = async (eventId) => {
  const event = await Event.findByPk(eventId);
  if (!event) return null;
  event.isImportant = false;
  event.importantMemo = null;
  return event.save();
};

// 중요 ?�정 목록
const getImportantEvents = async () =>
  Event.findAll({
    where: { isImportant: true },
    order: [['startDateTime', 'ASC']]
  });

// ?��??�는 중요 ?�정
const getUpcomingImportantEvents = async () =>
  Event.findAll({
    where: {
      isImportant: true,
      startDateTime: { [Op.gte]: new Date() }
    },
    order: [['startDateTime', 'ASC']]
  });

// 중요 메모 ?�데?�트
const updateImportantMemo = async (eventId, memo) => {
  const event = await Event.findByPk(eventId);
  if (!event) return null;
  event.importantMemo = memo;
  event.isImportant = true;
  return event.save();
};

// ?�워??검??
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

// ?�목 검??
const searchEventsByTitle = async (title) => {
  const like = `%${title}%`;
  return Event.findAll({
    where: { title: { [Op.like]: like } },
    order: [['startDateTime', 'ASC']]
  });
};

// ?�짜 검??
const searchEventsByDate = async (dateStr) => getEventsByDay(dateStr);

// 기간 검??
const searchEventsByPeriod = async (startDate, endDate) =>
  getEventsByRange(startDate, endDate);

// 최근 ?�정
const getRecentEvents = async (limit = 5) =>
  Event.findAll({
    order: [
      ['createdAt', 'DESC'],
      ['id', 'DESC']
    ],
    limit
  });

module.exports = {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getEventsByMonth,
  getEventsByWeek,
  getEventsByDay,
  getEventsForToday,
  getEventsByRange,
  markEventAsImportant,
  unmarkEventAsImportant,
  getImportantEvents,
  getUpcomingImportantEvents,
  updateImportantMemo,
  searchEventsByKeyword,
  searchEventsByTitle,
  searchEventsByDate,
  searchEventsByPeriod,
  getRecentEvents
};


