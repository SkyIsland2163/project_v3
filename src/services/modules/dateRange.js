/**
 * 날짜 범위 필터 유틸리티 모듈
 * 시작일과 종료일 사이의 이벤트를 찾는 쿼리 조건을 생성합니다.
 */

const { Op } = require('sequelize');

// 공통: 날짜 범위 필터 생성
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

module.exports = {
  buildDateRangeWhere
};
