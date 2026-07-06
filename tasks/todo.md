# 주간 업무 기록 — GitHub 배포 + 구글 시트 연동

## 목표
- index.html 을 GitHub(weeklytodolist)에 올리고 GitHub Pages로 퍼블리시
- 구글 시트 연동으로 어떤 컴퓨터에서도 같은 데이터로 작업

## 아키텍처
- 정적 페이지(GitHub Pages) + Google Apps Script Web App(백엔드)
- Apps Script가 구글 시트를 JSON 저장소로 사용 (doGet=불러오기, doPost=저장)
- 브라우저: 로드 시 GET, 변경 시 디바운스 POST (text/plain → CORS preflight 회피)
- localStorage 캐시로 오프라인/즉시 로드, updatedAt 타임스탬프로 기기 간 충돌 해결(최신 우선)

## 작업
- [x] gh 인증/repo 확인 (miracle03945-eng/weeklytodolist)
- [x] repo clone + index.html 복사
- [ ] index.html 에 동기화 모듈 추가 (로드/저장/상태표시/설정)
- [ ] Apps Script 코드(Code.gs) 작성
- [ ] SETUP.md 설치 안내(한국어) 작성
- [ ] README 갱신
- [ ] commit + push
- [ ] GitHub Pages 활성화 + URL 확인
- [ ] 사용자에게 구글 설정 단계 안내

## 리뷰
- 배포 완료: https://miracle03945-eng.github.io/weeklytodolist/ (HTTP 200, 빌드 성공)
- 동기화 모듈 4개 경로 노드 목 테스트 통과: 무설정/로컬저장/원격채택+렌더/POST(text-plain)
- 사용자가 직접 구글 계정으로 Apps Script 배포 완료 (모든 사용자 접근 허용) → 연동 정상 확인됨

## 2차 작업 (UI 개편, 2026-07-06)
- [x] 업무 기록 드래그 시 상태 자동 "완료" 처리 제거 → 기본값 "진행중" (칩 클릭으로 진행중→완료→보류 순환)
- [x] 요일 칸(월~일)에 건수 대신 업무 제목 표시 (최대 3개 + "+N개 더")
- [x] 업무 기록의 수동 입력 컴포저(할일 불러오기/요일·내용/카테고리·시간·상태) 전체 삭제
      → 이제 로그 추가는 오직 "해야 할 일" 드래그로만 가능
- [x] "해야 할 일" 폼에 제목 + 세부내용(선택) 필드 추가 (파일첨부는 사용자 요청으로 제외:
      구글 시트 셀 용량 제한(5만자)으로 상태 데이터 손상 위험 있어 미구현)
- jsdom 기반 헤드리스 브라우저 테스트로 폼 입력→드래그→로그 생성→상태 순환 전체 플로우 검증
- apps-script/Code.gs의 할일 시트 미러에 "세부내용" 컬럼 추가
