/**
 * 응답 및 에러 핸들링 유틸리티
 */

// 성공 응답
const sendSuccess = (res, data, statusCode = 200) => {
  return res.status(statusCode).json(data);
};

// 검증 오류 응답
const sendValidationError = (res, message) => {
  return res.status(400).json({ message });
};

// 찾을 수 없음 응답
const sendNotFound = (res, message = '요청한 항목을 찾을 수 없습니다.') => {
  return res.status(404).json({ message });
};

// 서버 오류 응답
const sendServerError = (res, message, error) => {
  return res.status(500).json({
    message,
    error: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
};

// 204 No Content 응답 (DELETE 성공)
const sendNoContent = (res) => {
  return res.status(204).send();
};

module.exports = {
  sendSuccess,
  sendValidationError,
  sendNotFound,
  sendServerError,
  sendNoContent
};
