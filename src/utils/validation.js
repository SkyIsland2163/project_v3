/**
 * 요청 검증 유틸리티
 */

// 이벤트 생성/수정 시 필수값 검증
const validateEventPayload = (body) => {
  const { title, startDateTime, endDateTime } = body;
  if (!title || !startDateTime || !endDateTime) {
    return 'title, startDateTime, endDateTime은 필수입니다.';
  }
  return null;
};

// 쿼리 파라미터 검증 - 필수 필드 확인
const validateRequiredParams = (params, requiredFields) => {
  const missing = requiredFields.find(field => !params[field]);
  if (missing) {
    return `${requiredFields.join(', ')} ${requiredFields.length > 1 ? '는' : '은'} 필수입니다.`;
  }
  return null;
};

// 연도, 월, 주 파라미터 검증
const validateCalendarParams = (year, month, week = null) => {
  const yearNum = Number(year);
  const monthNum = Number(month);

  if (!yearNum || yearNum < 1900 || yearNum > 2100) {
    return 'year는 유효한 연도여야 합니다.';
  }
  if (!monthNum || monthNum < 1 || monthNum > 12) {
    return 'month는 1~12 사이의 값이어야 합니다.';
  }
  if (week !== null) {
    const weekNum = Number(week);
    if (!weekNum || weekNum < 1 || weekNum > 5) {
      return 'week는 1~5 사이의 값이어야 합니다.';
    }
  }
  return null;
};

// 날짜 형식 검증 (YYYY-MM-DD)
const validateDateFormat = (dateStr) => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateStr)) {
    return 'YYYY-MM-DD 형식의 날짜를 입력하세요.';
  }
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    return '유효하지 않은 날짜입니다.';
  }
  return null;
};

module.exports = {
  validateEventPayload,
  validateRequiredParams,
  validateCalendarParams,
  validateDateFormat
};
