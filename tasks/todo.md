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
(완료 후 작성)
