/**
 * 주간 업무 기록 — Google Sheets 연동 백엔드 (Apps Script Web App)
 *
 * 이 코드는 구글 시트를 데이터 저장소로 사용합니다.
 *   - doGet  : 저장된 데이터를 JSON으로 돌려줌 (앱이 불러오기)
 *   - doPost : 앱에서 보낸 데이터를 시트에 저장
 *
 * 설치 방법은 저장소의 SETUP.md 를 참고하세요.
 */

var STATE_SHEET = '_state';   // 앱 원본 데이터(JSON) — 직접 수정하지 마세요
var LOG_SHEET   = '기록';      // 보기 좋은 업무 기록 (자동 생성/갱신)
var TODO_SHEET  = '할일';      // 보기 좋은 할 일 목록 (자동 생성/갱신)
var DOW = ['월', '화', '수', '목', '금', '토', '일'];

function doGet(e) {
  return json(readState());
}

function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);
    writeState(body);
    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function getSheet(name) {
  var ss = SpreadsheetApp.getActive();
  var sh = ss.getSheetByName(name);
  if (!sh) sh = ss.insertSheet(name);
  return sh;
}

function readState() {
  var raw = getSheet(STATE_SHEET).getRange('A1').getValue();
  if (!raw) return { entries: [], todos: [], updatedAt: 0 };
  try { return JSON.parse(raw); }
  catch (e) { return { entries: [], todos: [], updatedAt: 0 }; }
}

function writeState(data) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var state = {
      entries: Array.isArray(data.entries) ? data.entries : [],
      todos:   Array.isArray(data.todos)   ? data.todos   : [],
      updatedAt: data.updatedAt || Date.now()
    };
    getSheet(STATE_SHEET).getRange('A1').setValue(JSON.stringify(state));
    mirror(state);
  } finally {
    lock.releaseLock();
  }
}

function dowOf(dateStr) {
  if (!dateStr) return '';
  var d = new Date(dateStr + 'T00:00:00');
  return DOW[(d.getDay() + 6) % 7];
}

// 사람이 읽기 좋은 표로 미러링 (구글 시트에서 바로 보고 인쇄 가능)
function mirror(state) {
  var log = getSheet(LOG_SHEET);
  log.clearContents();
  var head = ['날짜', '요일', '업무 내용', '카테고리', '소요시간(h)', '상태'];
  var rows = state.entries.slice().sort(function (a, b) {
    return a.date < b.date ? -1 : a.date > b.date ? 1 : 0;
  }).map(function (e) {
    return [e.date, dowOf(e.date), e.task, e.category || '', (e.hours == null ? '' : e.hours), e.status];
  });
  var out = [head].concat(rows);
  log.getRange(1, 1, out.length, head.length).setValues(out);
  log.getRange(1, 1, 1, head.length).setFontWeight('bold');

  var td = getSheet(TODO_SHEET);
  td.clearContents();
  var thead = ['할 일', '요일', '상태', '주(월요일)'];
  var trows = state.todos.map(function (t) {
    return [t.text, dowOf(t.date), t.done ? '완료' : '미완료', t.week || ''];
  });
  var tout = [thead].concat(trows);
  td.getRange(1, 1, tout.length, thead.length).setValues(tout);
  td.getRange(1, 1, 1, thead.length).setFontWeight('bold');
}
