const request = require('supertest');
const { expect } = require('chai');
const app = require('../src/app');
const { sequelize, Event } = require('../src/database');

// 중요 일정 플래그/메모/목록/해제/예외 처리를 검증하는 테스트.
// 통과 조건: 각 요청이 기대 상태코드를 반환하고, isImportant/importantMemo 및 반환 목록이 예상대로 반영되어야 한다.

describe('Important API', () => {
  let futureEventId;
  let pastEventId;

  beforeEach(async () => {
    await sequelize.sync({ force: true });

    const now = new Date();
    const futureStart = new Date(now);
    futureStart.setDate(futureStart.getDate() + 2);
    const futureEnd = new Date(futureStart);
    futureEnd.setHours(futureEnd.getHours() + 2);

    const pastStart = new Date(now);
    pastStart.setDate(pastStart.getDate() - 5);
    const pastEnd = new Date(pastStart);
    pastEnd.setHours(pastEnd.getHours() + 2);

    const future = await Event.create({
      title: '미래 전략 컨퍼런스',
      startDateTime: futureStart,
      endDateTime: futureEnd
    });

    const past = await Event.create({
      title: '지난 워크샵',
      startDateTime: pastStart,
      endDateTime: pastEnd
    });

    futureEventId = future.id;
    pastEventId = past.id;
  });

  // 중요 표시 후 목록에 포함되는지(POST 200, GET 200, isImportant=true, 길이 1, id 일치)
  it('marks an event as important and lists it (POST /important/:id, GET /important)', async () => {
    const markRes = await request(app).post(`/important/${futureEventId}`);
    expect(markRes.status).to.equal(200);
    expect(markRes.body.isImportant).to.be.true;

    const listRes = await request(app).get('/important');
    expect(listRes.status).to.equal(200);
    expect(listRes.body).to.have.length(1);
    expect(listRes.body[0].id).to.equal(futureEventId);
  });

  // 중요 일정의 메모가 업데이트되는지(PATCH 200, memo/플래그 확인)
  it('updates memo for an important event (PATCH /important/:id/memo)', async () => {
    await request(app).post(`/important/${futureEventId}`);
    const memoRes = await request(app)
      .patch(`/important/${futureEventId}/memo`)
      .send({ memo: '발표 자료 지참' });

    expect(memoRes.status).to.equal(200);
    expect(memoRes.body.importantMemo).to.equal('발표 자료 지참');
    expect(memoRes.body.isImportant).to.be.true;
  });

  // 다가오는 중요 일정만 반환하는지(미래만 포함, 과거 제외)(GET 200, 길이 1, id 확인)
  it('returns upcoming important events (GET /important/upcoming)', async () => {
    await request(app).post(`/important/${futureEventId}`);
    await request(app).post(`/important/${pastEventId}`);

    const res = await request(app).get('/important/upcoming');
    expect(res.status).to.equal(200);
    expect(res.body).to.have.length(1);
    expect(res.body[0].id).to.equal(futureEventId);
  });

  // 중요 표시 해제 후 목록에서 제거되는지(DELETE 200, isImportant=false, 목록 길이 0)
  it('unmarks an important event (DELETE /important/:id)', async () => {
    await request(app).post(`/important/${futureEventId}`);

    const unmarkRes = await request(app).delete(`/important/${futureEventId}`);
    expect(unmarkRes.status).to.equal(200);
    expect(unmarkRes.body.isImportant).to.be.false;

    const listRes = await request(app).get('/important');
    expect(listRes.body).to.have.length(0);
  });

  // 존재하지 않는 이벤트를 표시하려 할 때 404를 반환하는지(POST 404)
  it('returns 404 when marking a non-existent event', async () => {
    const res = await request(app).post('/important/999999');
    expect(res.status).to.equal(404);
  });
});
