/**
 * Event Service
 * 모든 일정 관련 비즈니스 로직을 모듈화하여 관리합니다.
 */

// 모듈 임포트
const crudModule = require('./modules/crud');
const calendarModule = require('./modules/calendar');
const importantModule = require('./modules/important');
const searchModule = require('./modules/search');

// 모든 모듈의 함수를 통합 내보내기
module.exports = {
  // CRUD 작업
  ...crudModule,
  
  // 캘린더 조회
  ...calendarModule,
  
  // 중요 일정 관리
  ...importantModule,
  
  // 검색 기능
  ...searchModule
};


