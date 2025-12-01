const request = require('supertest');
const { expect } = require('chai');
const app = require('../src/app');
const { sequelize, Event } = require('../src/database');

const basePayload = {
  title: 'Sunday Service',
  description: 'Weekly worship',
  startDateTime: '2025-03-02T02:00:00.000Z',
  endDateTime: '2025-03-02T03:00:00.000Z',
  location: 'Main Hall',
  category: 'worship'
};

// 이벤트 생성/조회/수정/삭제와 필터링을 검증하는 테스트.
// 통과 조건: 각 요청이 기대 상태코드(2xx/404/400)를 반환하고, 응답 필드가 저장·수정된 값과 일치해야 한다.

describe('Events API', () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  // 이벤트 생성 후 단건 조회가 성공하는지(POST 201, GET 200, 제목 일치)
  it('creates an event (POST /events) and retrieves it (GET /events/:id)', async () => {
    const createRes = await request(app).post('/events').send(basePayload);
    expect(createRes.status).to.equal(201);
    const createdId = createRes.body.id;

    const fetchRes = await request(app).get(`/events/${createdId}`);
    expect(fetchRes.status).to.equal(200);
    expect(fetchRes.body.title).to.equal(basePayload.title);
  });

  // 날짜/카테고리 필터가 적용된 목록 조회가 올바른지(200, 길이 1, 제목 확인)
  it('lists events with date filtering (GET /events)', async () => {
    await Event.bulkCreate([
      basePayload,
      {
        title: 'Team Meeting',
        startDateTime: '2025-03-10T05:00:00.000Z',
        endDateTime: '2025-03-10T06:00:00.000Z',
        category: 'meeting'
      }
    ]);

    const res = await request(app)
      .get('/events')
      .query({ startDate: '2025-03-01', endDate: '2025-03-31', category: 'meeting' });

    expect(res.status).to.equal(200);
    expect(res.body).to.have.length(1);
    expect(res.body[0].title).to.equal('Team Meeting');
  });

  // 이벤트 수정이 성공하고 변경된 값이 반영되는지(PUT 200, 제목 변경 확인)
  it('updates an event (PUT /events/:id)', async () => {
    const { body } = await request(app).post('/events').send(basePayload);
    const updateRes = await request(app)
      .put(`/events/${body.id}`)
      .send({ ...basePayload, title: 'Sunday Service Updated' });

    expect(updateRes.status).to.equal(200);
    expect(updateRes.body.title).to.equal('Sunday Service Updated');
  });

  // 이벤트 삭제 후 재조회 시 404를 반환하는지(DELETE 204, 이후 GET 404)
  it('deletes an event (DELETE /events/:id) and returns 404 afterwards', async () => {
    const { body } = await request(app).post('/events').send(basePayload);

    const deleteRes = await request(app).delete(`/events/${body.id}`);
    expect(deleteRes.status).to.equal(204);

    const fetchRes = await request(app).get(`/events/${body.id}`);
    expect(fetchRes.status).to.equal(404);
  });

  // 잘못된 페이로드를 거부하는지(POST 400, 오류 메시지에 title 포함)
  it('rejects invalid payloads with 400 (POST /events)', async () => {
    const res = await request(app)
      .post('/events')
      .send({ title: 'Invalid Event', startDateTime: null, endDateTime: null });

    expect(res.status).to.equal(400);
    expect(res.body.message).to.include('title');
  });
});
