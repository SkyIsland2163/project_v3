const request = require('supertest');
const { expect } = require('chai');
const app = require('../src/app');
const { sequelize, Event } = require('../src/database');

// 검색 API 엔드포인트(키워드/제목/날짜/기간/최신)를 검증하는 테스트.
// 통과 조건: 각 요청이 200을 반환하고, 응답 배열 길이와 title 등 핵심 필드가 기대값과 일치해야 한다.

describe('Search API', () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });

    await Event.create({
      title: 'Family Retreat',
      description: 'Weekend retreat with families',
      startDateTime: '2025-06-10T00:00:00.000Z',
      endDateTime: '2025-06-12T00:00:00.000Z'
    });

    await Event.create({
      title: 'Choir Practice',
      description: 'Evening practice',
      startDateTime: '2025-05-03T19:00:00.000Z',
      endDateTime: '2025-05-03T20:00:00.000Z'
    });

    await Event.create({
      title: 'Board Meeting',
      description: 'Planning meeting',
      startDateTime: '2025-05-04T05:00:00.000Z',
      endDateTime: '2025-05-04T06:00:00.000Z'
    });

    await Event.create({
      title: 'Bible Study',
      description: 'Weekly group study',
      startDateTime: '2025-05-02T10:00:00.000Z',
      endDateTime: '2025-05-02T11:00:00.000Z'
    });
  });

  // 키워드가 제목/설명에 포함된 일정만 반환되는지 확인(200, 1건, 제목 확인)
  it('searches by keyword across title and description (GET /search/keyword)', async () => {
    const res = await request(app).get('/search/keyword').query({ keyword: 'retreat' });
    expect(res.status).to.equal(200);
    expect(res.body).to.have.length(1);
    expect(res.body[0].title).to.equal('Family Retreat');
  });

  // 제목에 특정 단어가 포함된 일정 1건이 반환되는지(200, 제목 확인)
  it('searches by title (GET /search/name)', async () => {
    const res = await request(app).get('/search/name').query({ title: 'Practice' });
    expect(res.status).to.equal(200);
    expect(res.body).to.have.length(1);
    expect(res.body[0].title).to.equal('Choir Practice');
  });

  // 지정 날짜의 일정 1건이 반환되는지(200, 제목 확인)
  it('searches by date (GET /search/date)', async () => {
    const res = await request(app).get('/search/date').query({ date: '2025-05-03' });
    expect(res.status).to.equal(200);
    expect(res.body).to.have.length(1);
    expect(res.body[0].title).to.equal('Choir Practice');
  });

  // 기간(start~end) 내 모든 일정이 포함되는지(200, 세 제목 포함)
  it('searches by period (GET /search/period)', async () => {
    const res = await request(app)
      .get('/search/period')
      .query({ startDate: '2025-05-01', endDate: '2025-05-04' });
    expect(res.status).to.equal(200);
    expect(res.body.map((e) => e.title)).to.have.members([
      'Bible Study',
      'Choir Practice',
      'Board Meeting'
    ]);
  });

  // 최신 생성 순으로 limit 개수만큼 반환되는지(200, 길이=limit, 첫 제목 확인)
  it('fetches recent events with limit (GET /search/recent)', async () => {
    const res = await request(app).get('/search/recent').query({ limit: 2 });
    expect(res.status).to.equal(200);
    expect(res.body).to.have.length(2);
    expect(res.body[0].title).to.equal('Bible Study');
  });
});
