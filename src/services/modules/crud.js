/**
 * CRUD 작업 모듈
 * 일정의 생성, 조회, 수정, 삭제 기능을 담당합니다.
 */

const { Event } = require('../../database');

// 일정 생성
const createEvent = async (payload) => {
  return Event.create(payload);
};

// 일정 목록 조회 (기간/카테고리 필터)
const getEvents = async ({ startDate, endDate, category }) => {
  const where = {};

  if (startDate && endDate) {
    const { buildDateRangeWhere } = require('./dateRange');
    Object.assign(where, buildDateRangeWhere(new Date(startDate), new Date(endDate)));
  } else if (startDate) {
    const { buildDateRangeWhere } = require('./dateRange');
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

// 단일 일정 조회
const getEventById = async (id) => Event.findByPk(id);

// 일정 수정
const updateEvent = async (id, payload) => {
  const event = await Event.findByPk(id);
  if (!event) return null;
  return event.update(payload);
};

// 일정 삭제
const deleteEvent = async (id) => {
  const event = await Event.findByPk(id);
  if (!event) return null;
  await event.destroy();
  return true;
};

module.exports = {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent
};
