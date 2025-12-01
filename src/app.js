const express = require('express');
const eventsRouter = require('./routes/events.router');
const calendarRouter = require('./routes/calendar.router');
const importantRouter = require('./routes/important.router');
const searchRouter = require('./routes/search.router');
const { initModels } = require('./database');

const app = express();

// 라우터 등록 및 서버 설정
app.use(express.json());

app.use('/events', eventsRouter);
app.use('/calendar', calendarRouter);
app.use('/important', importantRouter);
app.use('/search', searchRouter);

// 서버 시작 전에 DB sync 보장
initModels().catch((error) => {
  console.error('DB 초기화 실패:', error);
});

module.exports = app;

