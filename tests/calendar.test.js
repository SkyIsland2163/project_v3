const request = require('supertest');
const { expect } = require('chai');
const app = require('../src/app');
const { sequelize, Event } = require('../src/database');

// 캘린더 API 월/주/일/오늘/범위 조회 엔드포인트를 검증하는 테스트.
// 통과 조건: 각 요청이 200을 반환하고, 응답 배열/필드가 기대한 일정 제목과 개수를 포함해야 한다.

describe('Calendar API', () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });

    const today = new Date();
    const todayStart = new Date(today);
    todayStart.setHours(12, 0, 0, 0);
    const todayEnd = new Date(todayStart);
    todayEnd.setHours(13, 0, 0, 0);

    await Event.bulkCreate([
      {
        title: '3월 킥오프',
        startDateTime: '2025-03-03T09:00:00.000Z',
        endDateTime: '2025-03-03T10:00:00.000Z'
      },
      {
        title: '3월 팀 싱크',
        startDateTime: '2025-03-10T05:00:00.000Z',
        endDateTime: '2025-03-10T06:00:00.000Z'
      },
      {
        title: '3월 마감',
        startDateTime: '2025-03-28T02:00:00.000Z',
        endDateTime: '2025-03-28T03:00:00.000Z'
      },
      {
        title: '4월 기획',
        startDateTime: '2025-04-15T02:00:00.000Z',
        endDateTime: '2025-04-15T03:00:00.000Z'
      },
      {
        title: '오늘의 일정',
        startDateTime: todayStart,
        endDateTime: todayEnd
      }
    ]);
  });

  // 특정 월(year, month)의 모든 이벤트가 포함되는지(200, 제목 멤버 확인)
  it('returns events for a month (GET /calendar/month)', async () => {
    const res = await request(app).get('/calendar/month').query({ year: 2025, month: 3 });
    expect(res.status).to.equal(200);
    expect(res.body.map((e) => e.title)).to.have.members(['3월 킥오프', '3월 팀 싱크', '3월 마감']);
  });

  // 지정 주차(year, month, week)의 이벤트만 반환되는지(200, 길이 1, 제목 확인)
  it('returns events for a week number (GET /calendar/week)', async () => {
    const res = await request(app).get('/calendar/week').query({ year: 2025, month: 3, week: 2 });
    expect(res.status).to.equal(200);
    expect(res.body).to.have.length(1);
    expect(res.body[0].title).to.equal('3월 팀 싱크');
  });

  // 특정 날짜(date)의 이벤트만 반환되는지(200, 길이 1, 제목 확인)
  it('returns events for a specific day (GET /calendar/day)', async () => {
    const res = await request(app).get('/calendar/day').query({ date: '2025-03-10' });
    expect(res.status).to.equal(200);
    expect(res.body).to.have.length(1);
    expect(res.body[0].title).to.equal('3월 팀 싱크');
  });

  // 오늘 날짜의 이벤트를 포함하는지(200, Today Event 존재 확인)
  it("returns today's events (GET /calendar/today)", async () => {
    const res = await request(app).get('/calendar/today');
    expect(res.status).to.equal(200);
    expect(res.body.some((event) => event.title === '오늘의 일정')).to.be.true;
  });

  // 시작~종료 범위 안 이벤트만 반환되는지(200, 두 제목 멤버 확인)
  it('returns events within a range (GET /calendar/range)', async () => {
    const res = await request(app)
      .get('/calendar/range')
      .query({ startDate: '2025-03-01', endDate: '2025-03-15' });
    expect(res.status).to.equal(200);
    expect(res.body.map((e) => e.title)).to.have.members(['3월 킥오프', '3월 팀 싱크']);
  });
});
