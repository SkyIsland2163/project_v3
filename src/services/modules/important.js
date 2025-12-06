/**
 * 중요 일정 관리 모듈
 * 일정의 중요도 설정/해제, 메모 관리 기능을 담당합니다.
 */

const { Event } = require('../../database');
const { Op } = require('sequelize');

// 중요 일정 등록
const markEventAsImportant = async (eventId) => {
  const event = await Event.findByPk(eventId);
  if (!event) return null;
  event.isImportant = true;
  return event.save();
};

// 중요 일정 해제
const unmarkEventAsImportant = async (eventId) => {
  const event = await Event.findByPk(eventId);
  if (!event) return null;
  event.isImportant = false;
  event.importantMemo = null;
  return event.save();
};

// 중요 일정 목록 조회
const getImportantEvents = async () =>
  Event.findAll({
    where: { isImportant: true },
    order: [['startDateTime', 'ASC']]
  });

// 다가오는 중요 일정 조회
const getUpcomingImportantEvents = async () =>
  Event.findAll({
    where: {
      isImportant: true,
      startDateTime: { [Op.gte]: new Date() }
    },
    order: [['startDateTime', 'ASC']]
  });

// 중요 메모 수정
const updateImportantMemo = async (eventId, memo) => {
  const event = await Event.findByPk(eventId);
  if (!event) return null;
  event.importantMemo = memo;
  event.isImportant = true;
  return event.save();
};

module.exports = {
  markEventAsImportant,
  unmarkEventAsImportant,
  getImportantEvents,
  getUpcomingImportantEvents,
  updateImportantMemo
};
