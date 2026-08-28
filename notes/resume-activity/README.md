# Resume activity inbox

이 디렉터리는 일일·주간 작업 요약에서 이력서 가치가 있는 항목만 남기는 로컬 정본입니다. 다음 이력서 업데이트에서는 Claude 세션 전체를 다시 읽지 않고 월별 YAML의 `status: candidate` 항목부터 검토합니다.

## 상태 흐름

- `candidate`: 다음 이력서 업데이트 검토 대상
- `reflected`: 이력서와 상세 포트폴리오에 반영 완료
- `skip`: 이력서에는 쓰지 않기로 결정

이력서를 수정하기 전에는 후보별 변경 위치와 문구를 먼저 제안하고 사용자의 승인을 받습니다. 승인 후 `src/content/resume/profile.yaml`과 연결된 `src/lib/portfolio-content.ts`를 함께 갱신한 뒤 상태를 `reflected`로 바꿉니다.

## 기록 기준

다음 중 하나 이상에 해당하는 완료 작업만 기록합니다.

- 서비스나 시스템의 구조를 바꾼 설계·구현
- 수치로 설명 가능한 품질·비용·속도 개선
- 여러 저장소·MSA에 적용한 표준화
- 결제·보안·데이터 정합성·무중단 운영 같은 고위험 영역의 안정화
- 새로 맡은 서비스나 역할의 범위를 보여주는 작업

단순 배포, 버전 변경, 일회성 조회·CS 처리, 작은 UI 수정, 열린 PR만 있는 작업은 기본적으로 제외합니다. 진행 중인 큰 작업을 남길 때는 `delivery: in_progress`로 기록하며 완료 전에는 이력서에 반영하지 않습니다.

## 안전 규칙

- 고객 ID, 주문번호, 전화번호, 원본 로그, 토큰·키·사내 비밀값을 기록하지 않습니다.
- 근거는 PR URL, 공개 가능한 이슈 번호, 커밋 해시처럼 다시 확인할 수 있는 참조만 남깁니다.
- 같은 근거 URL이나 커밋 해시가 있으면 새 항목을 추가하지 말고 기존 항목을 갱신합니다.
- 효과를 측정하지 않았다면 수치를 만들지 않고 `impact`에 정성적으로 기록합니다.

## 파일 형식

월별 `YYYY-MM.yaml` 파일에 다음 필드를 사용합니다.

```yaml
entries:
  - id: 2026-08-short-topic
    period: 2026-08-01..2026-08-15
    status: candidate
    delivery: merged
    area: billing
    headline: 한 줄 성과
    impact: 이력서에서 설명할 가치
    metrics: []
    evidence:
      prs: []
      commits: []
    resume_targets: []
    reflected_at:
    skip_reason:
```
