# Event Service 모듈화 가이드

## 📋 개요

기존 `event.service.js`의 모든 함수를 **기능별로 모듈화**하여 더 나은 유지보수성과 확장성을 제공합니다.

---

## 🏗️ 모듈 구조

```
src/services/
├── event.service.js          ← 모든 모듈을 통합하는 메인 파일
└── modules/
    ├── dateRange.js          ← 날짜 범위 필터 유틸리티
    ├── crud.js               ← CRUD 작업 (생성, 조회, 수정, 삭제)
    ├── calendar.js           ← 캘린더 조회 (월, 주, 일, 기간)
    ├── important.js          ← 중요 일정 관리
    └── search.js             ← 검색 기능 (키워드, 제목, 날짜, 기간, 최근)
```

---

## 📦 각 모듈의 역할

### 1️⃣ **dateRange.js** (유틸리티)
```javascript
buildDateRangeWhere(start, end)
```
- **역할**: 시작일과 종료일 사이의 이벤트 필터 조건 생성
- **사용처**: calendar, crud, search 모듈에서 공통으로 사용
- **반환**: Sequelize의 Op 조건 객체

---

### 2️⃣ **crud.js** (CRUD 작업)
```javascript
createEvent(payload)           // 일정 생성
getEvents(filters)             // 일정 목록 조회 (필터 포함)
getEventById(id)               // 단일 일정 조회
updateEvent(id, payload)       // 일정 수정
deleteEvent(id)                // 일정 삭제
```

**특징**:
- 기본적인 CRUD 작업 담당
- dateRange 유틸 활용
- 5개 함수 포함

---

### 3️⃣ **calendar.js** (시간 단위 조회)
```javascript
getEventsByMonth(year, month)       // 월별 일정
getEventsByWeek(year, month, week)  // 주별 일정
getEventsByDay(dateStr)             // 일별 일정
getEventsForToday()                 // 오늘 일정
getEventsByRange(startDate, endDate) // 기간별 일정
```

**특징**:
- 다양한 시간 단위의 일정 조회
- dateRange 유틸 활용
- 5개 함수 포함

---

### 4️⃣ **important.js** (중요 일정 관리)
```javascript
markEventAsImportant(eventId)           // 중요 표시
unmarkEventAsImportant(eventId)         // 중요 해제
getImportantEvents()                    // 중요 일정 조회
getUpcomingImportantEvents()            // 다가오는 중요 일정
updateImportantMemo(eventId, memo)      // 메모 수정
```

**특징**:
- 중요 일정의 관리와 조회
- 메모 기능 포함
- 5개 함수 포함

---

### 5️⃣ **search.js** (검색 기능)
```javascript
searchEventsByKeyword(keyword)     // 키워드 검색
searchEventsByTitle(title)         // 제목 검색
searchEventsByDate(dateStr)        // 날짜 검색
searchEventsByPeriod(startDate, endDate) // 기간 검색
getRecentEvents(limit)             // 최근 일정 조회
```

**특징**:
- 다양한 조건의 검색
- calendar 모듈 활용 (searchEventsByDate, searchEventsByPeriod)
- 5개 함수 포함

---

## 🔄 흐름도

### 컨트롤러에서의 사용

```
컨트롤러
  ↓
require('../services/event.service')
  ↓
event.service.js (모든 모듈 통합)
  ↓ (spread operator로 병합)
┌─────────────────────────────────┐
│ dateRange (유틸)                │
│ crud (5개 함수)                 │
│ calendar (5개 함수)             │
│ important (5개 함수)            │
│ search (5개 함수)               │
└─────────────────────────────────┘
  ↓
실제 함수 호출
```

---

## 💡 사용 방법

### Before (모듈화 전)
```javascript
// 파일이 237줄로 길고 관리하기 어려움
const { 
  createEvent, 
  getEventsByMonth,
  markEventAsImportant,
  searchEventsByKeyword 
} = require('../services/event.service');
```

### After (모듈화 후)
```javascript
// 동일한 방식으로 사용 가능 (하지만 백엔드는 모듈화됨)
const { 
  createEvent, 
  getEventsByMonth,
  markEventAsImportant,
  searchEventsByKeyword 
} = require('../services/event.service');

// 모든 함수가 event.service.js를 통해 병합되므로 사용 방식은 동일함
```

---

## ✨ 모듈화의 장점

| 측면 | Before | After |
|------|--------|-------|
| 파일 크기 | 237줄 (1개 파일) | 각 모듈 40~60줄 (5개 파일) |
| 가독성 | 낮음 (모든 함수 혼재) | 높음 (기능별 분리) |
| 유지보수 | 어려움 | 쉬움 (필요한 모듈만 수정) |
| 재사용성 | 낮음 | 높음 (모듈 단위 재사용) |
| 테스트 | 어려움 | 쉬움 (모듈 단위 테스트) |
| 확장성 | 낮음 | 높음 (새 모듈 추가 용이) |

---

## 🔧 새로운 기능 추가 방법

### 예시: 통계 기능 추가

**1단계**: 새 모듈 생성
```javascript
// src/services/modules/statistics.js
const getEventStatistics = async () => {
  // 통계 로직
};

const getMonthlyEventCount = async (year, month) => {
  // 월별 이벤트 개수
};

module.exports = {
  getEventStatistics,
  getMonthlyEventCount
};
```

**2단계**: event.service.js에 통합
```javascript
const statisticsModule = require('./modules/statistics');

module.exports = {
  ...crudModule,
  ...calendarModule,
  ...importantModule,
  ...searchModule,
  ...statisticsModule  // 추가
};
```

**3단계**: 컨트롤러에서 사용
```javascript
const { getEventStatistics } = require('../services/event.service');
```

---

## 📊 함수 분포

| 모듈 | 함수 개수 | 기능 |
|------|---------|------|
| dateRange | 1 | 유틸리티 |
| crud | 5 | CRUD 작업 |
| calendar | 5 | 시간 단위 조회 |
| important | 5 | 중요 일정 관리 |
| search | 5 | 검색 기능 |
| **합계** | **21** | **모든 기능** |

---

## 🎯 마이그레이션 체크리스트

- ✅ 모듈 파일 생성 (dateRange, crud, calendar, important, search)
- ✅ event.service.js 업데이트 (모듈 통합)
- ✅ 모든 import 경로 확인
- ✅ 기존 코드와 호환성 확인
- ✅ 테스트 실행

---

## 🧪 테스트 방법

```bash
# 전체 테스트
npm test

# 모듈별 테스트 (나중에 구현 가능)
npm test -- tests/services/modules/crud.test.js
npm test -- tests/services/modules/calendar.test.js
npm test -- tests/services/modules/important.test.js
npm test -- tests/services/modules/search.test.js
```

---

## 📝 요약

기존의 거대한 `event.service.js` 파일을 **기능별 5개의 모듈**로 분리하여:
- 🎯 **가독성** 향상
- 🔧 **유지보수** 용이
- 📈 **확장성** 증대
- 🧪 **테스트** 간편

모든 함수는 기존과 동일하게 `event.service.js`를 통해 접근 가능하므로 **기존 코드와 완벽 호환**입니다! ✨

---

**작성자**: 자동 모듈화 시스템  
**날짜**: 2025-12-07
