# Resume update workflow

이력서 작업 전 `.agents/skills/resume-worklog/SKILL.md`와 `notes/resume-activity/README.md`를 읽습니다. 월별 YAML에서 미반영 `candidate`만 추려 변경 위치와 문구를 먼저 보여주고, 사용자 승인 후 `profile.yaml`과 연결된 `portfolio-content.ts`를 함께 수정합니다. 반영이 끝나면 해당 후보를 `reflected`로 변경합니다.

이력서 내용, 템플릿, 페이지네이션, 인쇄 CSS, 폰트, PDF 출력 변경을 커밋하기 전 `.agents/skills/resume-a4-check/SKILL.md`를 사용합니다. `npm run verify:a4`로 한글/영문 × 기본/크리에이티브 4종을 모두 통과시키고 생성된 모든 페이지 이미지를 직접 확인합니다. 실패하거나 육안 검수하지 않은 결과는 커밋하지 않습니다.

영문 이력서는 한국어 문장을 직역하지 않습니다. 한국어에서 역할·행동·범위·성과를 먼저 추출한 뒤 해외 채용자가 이해할 수 있는 자연스러운 영문으로 작성하고, 국내 서비스는 첫 등장에 짧게 설명합니다. MSA·PG·Admin·유저사이드 같은 내부 용어는 microservices·payment gateway·operations console·customer-facing처럼 풀어 쓰며, 한·영의 날짜·수치·책임 범위를 동일하게 유지합니다. 한국어 원문 자체의 범위가 불분명할 때만 사용자에게 확인합니다.
