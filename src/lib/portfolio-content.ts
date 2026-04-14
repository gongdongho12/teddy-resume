import type { Lang, Localized } from '@/lib/resume-types';

export interface PortfolioProject {
  title: Localized;
  period: Localized;
  company: Localized;
  roleLabel: Localized;
  summary: Localized;
  challenge: Localized;
  actions: Localized[];
  outcomes: Localized[];
  note: Localized;
  tech: string[];
}

export interface PortfolioContent {
  slug: string;
  title: Localized;
  eyebrow: Localized;
  intro: Localized;
  roleFocus: Localized[];
  projects: PortfolioProject[];
}

export const kakaoPiccomaPortfolio: PortfolioContent = {
  slug: 'portfolio',
  title: {
    ko: '프로젝트 포트폴리오',
    en: 'Project Portfolio',
  },
  eyebrow: {
    ko: '결제, 가격 계산, 멤버십, 프로모션, DX 영역의 주요 사례',
    en: 'Selected cases across payments, pricing, membership, promotions, and DX',
  },
  intro: {
    ko:
      '경력기술서와 이력서에 정리한 프로젝트 가운데, 멀티 PG 결제, 가격 계산 API, 멤버십 이관, 포인트 지갑 설계, DX 자동화처럼 설계 판단과 운영 기준을 설명하기 좋은 사례를 골라 정리했습니다.',
    en:
      'This page focuses on projects such as multi-PG payments, pricing APIs, membership migration, point-wallet design, and DX automation that are especially useful for explaining design decisions and operating standards in backend work.',
  },
  roleFocus: [
    {
      ko: 'Kotlin/Spring Boot 중심의 백엔드 개발 경험',
      en: 'Backend development experience centered on Kotlin and Spring Boot',
    },
    {
      ko: 'OAuth2, PG, 게이트웨이, 외부 인증서 서비스가 포함된 MSA 연동 경험',
      en: 'Experience integrating MSAs with OAuth2, PGs, gateways, and external certificate services',
    },
    {
      ko: 'Pub/Sub DLQ, Athena 배치, 월간 파티션, Fallback 기반 운영 안정화 경험',
      en: 'Operational stabilization with Pub/Sub DLQ, Athena batches, monthly partitions, and fallback patterns',
    },
    {
      ko: 'run-gemini-cli, Docusaurus, Firebase App Distribution, Jenkins/TestFlight 기반 DX 개선 경험',
      en: 'DX improvements using run-gemini-cli, Docusaurus, Firebase App Distribution, and Jenkins/TestFlight',
    },
  ],
  projects: [
    {
      title: {
        ko: '멀티 PG 결제 시스템 및 정산 안정화',
        en: 'Multi-PG Payment System and Settlement Stabilization',
      },
      period: {
        ko: '2024.10 - 현재',
        en: 'Oct 2024 - Present',
      },
      company: {
        ko: 'LG유플러스 볼트업',
        en: 'LG Uplus VoltUp',
      },
      roleLabel: {
        ko: '서비스 초기 설계부터 구현까지 전담',
        en: 'Owned the service from initial design to implementation',
      },
      summary: {
        ko:
          '결제 서비스 초기 설계부터 구현까지 전담하며, 단일 카카오페이 구조를 카카오페이·토스페이먼츠·카카오T를 포함한 멀티 PG 구조로 확장하고, DLQ 기반 미수 이벤트 처리와 자동 복구 체계를 구성했습니다.',
        en:
          'Owned the payment service from initial design through implementation, expanding a single KakaoPay flow into a multi-PG structure and building DLQ-based unpaid-event processing with automatic recovery.',
      },
      challenge: {
        ko:
          '단일 PG(카카오페이)에서 카카오페이, 토스페이먼츠, 카카오T를 포함한 3개 PG사로 확장하고, 미수 처리까지 함께 다루는 구조가 필요했습니다.',
        en:
          'The service needed to expand from a single PG to three PG providers while also handling unpaid-processing flows.',
      },
      actions: [
        {
          ko: '추상 클래스 기반 벤더 전략 패턴으로 PG사 통합 아키텍처를 구성했습니다.',
          en: 'Built a PG integration architecture with an abstract-class-based vendor strategy pattern.',
        },
        {
          ko: 'GCP Pub/Sub 기반 DLQ 패턴을 구현하고 커스텀 어노테이션 및 핸들러 자동 디스커버리를 적용했습니다.',
          en: 'Implemented a GCP Pub/Sub-based DLQ pattern with custom annotations and handler auto-discovery.',
        },
        {
          ko: '재시도, DLQ, NACK 기반 자동 복구 경로를 구현해 미수 이벤트가 정산 보완 경로로 이어지도록 구성했습니다.',
          en: 'Implemented retries, DLQ, and NACK-based recovery paths so unpaid events could flow into settlement recovery.',
        },
      ],
      outcomes: [
        {
          ko: '3개 PG사를 단일 인터페이스로 통합하는 결제 아키텍처를 완성했습니다.',
          en: 'Completed a payment architecture that integrates three PG providers through a single interface.',
        },
        {
          ko: 'DLQ 기반 미수 이벤트 처리와 자동 복구 경로를 운영에 적용했습니다.',
          en: 'Applied DLQ-based unpaid-event processing and automatic recovery paths in operation.',
        },
      ],
      note: {
        ko: 'PG 확장과 미수 이벤트 재처리 기준을 함께 설명할 수 있는 프로젝트입니다.',
        en: 'A project for explaining both PG expansion and unpaid-event retry strategy.',
      },
      tech: ['Kotlin', 'Spring Boot', 'Spring Batch', 'GCP Pub/Sub', 'Cloud SQL'],
    },
    {
      title: {
        ko: '유저 사이드 백엔드: 카카오T 계정/결제 연동',
        en: 'User-Side Backend: Kakao T Account and Payment Integration',
      },
      period: {
        ko: '2025.07 - 현재',
        en: 'Jul 2025 - Present',
      },
      company: {
        ko: 'LG유플러스 볼트업',
        en: 'LG Uplus VoltUp',
      },
      roleLabel: {
        ko: 'OAuth2 계정 연결, 결제수단 등록, 차량/PnC 등록 기능 개발',
        en: 'Built OAuth2 account linking, payment method registration, and vehicle/PnC registration flows',
      },
      summary: {
        ko:
          '유저 사이드 백엔드에서 카카오T OAuth2 계정 연결, 결제수단 등록 5단계, 승인·부분 취소, 차량 등록, PnC 인증 등록 기능을 함께 개발했습니다.',
        en:
          'Worked on user-side backend flows including Kakao T OAuth2 account linking, five-step payment method registration, approval and partial cancellation, vehicle registration, and PnC certification registration.',
      },
      challenge: {
        ko:
          '하나의 유저 사이드 백엔드 안에서 카카오T 계정/결제 연동과 차량 등록, PnC 인증 등록, 외부 인증서 서비스 연동을 함께 다뤘습니다.',
        en:
          'This user-side backend area covered Kakao T account/payment integration, vehicle registration, PnC certification registration, and external certificate-service integration together.',
      },
      actions: [
        {
          ko: '카카오T 연동 영역에서는 OAuth2 기반 계정 연동과 결제수단 등록 5단계, 결제 승인 및 부분 취소 플로우를 담당했습니다.',
          en: 'On the Kakao T integration side, handled OAuth2 account linking, the five-step payment method registration flow, and payment approval/partial cancellation.',
        },
        {
          ko: '차량 등록과 PnC 인증 등록 영역에서는 외부 인증서 서비스 장애 시 자동 비활성화 및 강제 리셋 Fallback을 구현했습니다.',
          en: 'For vehicle registration and PnC certification flows, implemented auto-disable and forced-reset fallback behavior for external certificate-service failures.',
        },
        {
          ko: '프로모션 쿠폰 발급 배치도 같은 영역에서 설계하고 구현했습니다.',
          en: 'Also designed and implemented the promotion coupon issuance batch in the same area.',
        },
      ],
      outcomes: [
        {
          ko: '카카오T 제휴사 연동에서는 결제수단 등록, 결제, 취소, 프로모션 전체 사이클을 구현했습니다.',
          en: 'In the Kakao T partner integration, implemented the full cycle of payment method registration, payment, cancellation, and promotion.',
        },
        {
          ko: '차량 등록 및 PnC 인증 등록 경로에는 외부 인증서 서비스 장애 대응 Fallback 로직을 적용했습니다.',
          en: 'Applied fallback logic for external certificate-service failures in vehicle registration and PnC certification paths.',
        },
      ],
      note: {
        ko: '4개 MSA 경계와 외부 인증서 장애 대응 기준을 함께 설명할 수 있는 프로젝트입니다.',
        en: 'A project useful for explaining both 4-MSA boundaries and certificate-service failure handling.',
      },
      tech: ['Kotlin', 'Spring Boot', 'GCP Pub/Sub', 'Flyway', 'OAuth2'],
    },
    {
      title: {
        ko: '통합 프로모션(쿠폰/포인트) 플랫폼 구축',
        en: 'Unified Promotion Platform for Coupons and Points',
      },
      period: {
        ko: '2025.07 - 2025.10',
        en: 'Jul 2025 - Oct 2025',
      },
      company: {
        ko: 'LG유플러스 볼트업',
        en: 'LG Uplus VoltUp',
      },
      roleLabel: {
        ko: '포인트 지갑, 만료 처리, 쿠폰 발급 배치 설계',
        en: 'Designed point wallets, expiration handling, and coupon issuance batches',
      },
      summary: {
        ko:
          '제휴사별 쿠폰 조건을 수용하는 백엔드와 함께, 적립 건마다 만료일이 달라지는 스펙을 처리하기 위해 포인트 지갑 구조, 만료 순서 차감, 다음 달 히스토리 반영 배치를 설계했습니다.',
        en:
          'Built backend handling for partner-specific coupon conditions and designed point wallets, expiration-order redemption, and next-month history batching to support per-accrual expiration dates.',
      },
      challenge: {
        ko:
          '넥센, 도요타, 블루멤버스 등 제휴사별 요구사항과 함께, 포인트가 추가될 때마다 유효기간이 달라지는 스펙을 처리할 구조가 필요했습니다.',
        en:
          'The project had to support partner-specific promotion requirements together with a point model where each accrual could have a different expiration date.',
      },
      actions: [
        {
          ko: '적립 건마다 유효기간이 달라지는 문제를 처리하기 위해 포인트 지갑을 여러 개 두는 구조와 Hold, Confirm, Release 상태 전이를 구현했습니다.',
          en: 'Implemented multiple point wallets and Hold/Confirm/Release state transitions to handle cases where each accrual has a different expiration date.',
        },
        {
          ko: '지갑 단위로 잔액을 관리하고, 포인트 사용 시 만료일이 가장 가까운 지갑부터 차감되도록 구현했습니다.',
          en: 'Managed balance at the wallet level and made redemption consume the wallet with the nearest expiration first.',
        },
        {
          ko: '당월 만료 포인트는 지갑 잔액으로 노출하고, 히스토리 테이블에는 다음 달 배치로 반영하는 처리와 제휴사별 쿠폰 발급 조건을 함께 개발했습니다.',
          en: 'Implemented a flow where same-month expired points remain visible in wallet balance and are written to the history table by a next-month batch, alongside partner-specific coupon issuance conditions.',
        },
      ],
      outcomes: [
        {
          ko: '다수 제휴사 프로모션 요구사항을 단일 플랫폼에서 수용했습니다.',
          en: 'Supported multiple partner promotion requirements on a single platform.',
        },
        {
          ko: '포인트 지갑, 만료 순서 차감, 다음 달 히스토리 배치 반영을 하나의 백엔드로 운영할 수 있게 정리했습니다.',
          en: 'Organized point wallets, expiration-order redemption, and next-month history batching into one backend service.',
        },
      ],
      note: {
        ko: '포인트 잔액, 만료, 히스토리 반영 시점을 어떻게 나눴는지 설명하기 좋은 프로젝트입니다.',
        en: 'A good project for explaining how balance display, expiration, and history timing were separated.',
      },
      tech: ['Kotlin', 'Spring Boot', 'MySQL', 'JPA', 'QueryDSL'],
    },
    {
      title: {
        ko: '개발 생산성 자동화 및 DevOps 개선',
        en: 'Developer Productivity Automation and DevOps Improvements',
      },
      period: {
        ko: '2024.10 - 현재',
        en: 'Oct 2024 - Present',
      },
      company: {
        ko: 'LG유플러스 볼트업',
        en: 'LG Uplus VoltUp',
      },
      roleLabel: {
        ko: 'AI 코드 리뷰, 문서 생성, QA 배포 자동화',
        en: 'AI-assisted review, documentation generation, and QA distribution automation',
      },
      summary: {
        ko:
          'MSA 환경에 맞춘 run-gemini-cli 기반 1차 코드 리뷰, Docusaurus + GitHub Actions 문서 생성, Firebase App Distribution QA 배포, Android/iOS 배포 자동화를 정리했습니다.',
        en:
          'Worked on run-gemini-cli first-pass code review, Docusaurus plus GitHub Actions documentation generation, Firebase App Distribution QA delivery, and Android/iOS deployment automation in an MSA environment.',
      },
      challenge: {
        ko:
          'AI 리뷰 기준, 문서 최신화, QA용 앱 전달, 로컬 설정 자동 생성처럼 반복 비용이 큰 작업을 공통 흐름으로 정리할 필요가 있었습니다.',
        en:
          'The team needed shared workflows for repetitive work such as AI review standards, documentation freshness, QA app delivery, and local setup generation.',
      },
      actions: [
        {
          ko: 'GitHub Copilot, Claude Code, Cursor, Antigravity에 공통으로 적용할 사내 컨벤션 기반 작업 스킬 레포지토리를 정리했습니다.',
          en: 'Built a shared repository of internal-convention-based skills used across GitHub Copilot, Claude Code, Cursor, and Antigravity.',
        },
        {
          ko: 'run-gemini-cli 기반 1차 코드 리뷰 자동화와 Docusaurus + GitHub Actions 기반 Git Polling 문서 생성 체계를 구성했습니다.',
          en: 'Built run-gemini-cli first-pass review automation and a Git-polling documentation pipeline with Docusaurus and GitHub Actions.',
        },
        {
          ko: 'application-local.yaml 자동 생성 도구, Firebase App Distribution 기반 QA용 앱 배포, Android Jenkins 공통 라이브러리, iOS TestFlight 자동 배포를 정리했습니다.',
          en: 'Set up application-local.yaml generation, QA app delivery with Firebase App Distribution, shared Android Jenkins libraries, and automated iOS TestFlight deployment.',
        },
      ],
      outcomes: [
        {
          ko: '1차 코드 리뷰 자동화, QA용 앱 배포 흐름, 문서 생성 파이프라인을 공통 작업으로 묶었습니다.',
          en: 'Turned first-pass review automation, QA app delivery, and documentation generation into shared workflows.',
        },
        {
          ko: 'QA 배포 사이클 단축과 문서 관리 비용 절감에 기여했습니다.',
          en: 'Contributed to shorter QA delivery cycles and lower documentation maintenance cost.',
        },
      ],
      note: {
        ko: 'AI 도구 자체보다 팀 규칙과 배포 흐름을 어떻게 문서화했는지 보여주는 DX 프로젝트입니다.',
        en: 'A DX project that shows how team rules and delivery flows were documented, not just which AI tools were used.',
      },
      tech: ['Gemini API', 'GitHub Copilot', 'Claude Code', 'Cursor', 'GitHub Actions', 'Jenkins', 'Firebase App Distribution'],
    },
    {
      title: {
        ko: '파이널 프라이싱 API',
        en: 'Final Pricing API',
      },
      period: {
        ko: '2023.12 - 2024.09',
        en: 'Dec 2023 - Sep 2024',
      },
      company: {
        ko: '카카오스타일',
        en: 'Kakao Style',
      },
      roleLabel: {
        ko: '쿠폰·프로모션·할인 계산을 하나의 API로 통합',
        en: 'Unified coupon, promotion, and discount calculation into one API',
      },
      summary: {
        ko:
          '각 지면별로 흩어져 있던 쿠폰, 프로모션, 할인 계산을 하나의 API로 모아 가격 계산 위치를 중앙화했습니다.',
        en:
          'Centralized coupon, promotion, and discount calculation into a single API instead of leaving pricing logic scattered across surfaces.',
      },
      challenge: {
        ko:
          '전사 지면마다 흩어져 있는 가격 계산식을 하나로 모으면서도 가격 노출 정합성을 유지하는 구조가 필요했습니다.',
        en:
          'The project required consolidating pricing formulas across company surfaces while keeping displayed prices consistent.',
      },
      actions: [
        {
          ko: '전사 지면의 금액 계산식을 정리하고 DGS Framework 기반 통합 API를 설계했습니다.',
          en: 'Mapped the price-calculation formulas used across company surfaces and designed a unified API with DGS Framework.',
        },
        {
          ko: 'GraphQL DataLoader로 동일 상품 가격 계산의 중복 호출을 줄여 전 지면 가격 계산 부하를 낮췄습니다.',
          en: 'Used GraphQL DataLoader to reduce duplicate calls for the same product and lower pricing load across all surfaces.',
        },
        {
          ko: 'Resilience4j 기반 타임아웃과 서킷브레이커를 적용했습니다.',
          en: 'Applied Resilience4j-based timeouts and circuit breakers.',
        },
      ],
      outcomes: [
        {
          ko: '쿠폰, 프로모션, 할인 계산을 하나의 API로 통합했습니다.',
          en: 'Unified coupon, promotion, and discount calculation into a single API.',
        },
        {
          ko: '동일 상품 가격 계산의 중복 호출을 줄여 상품 전 지면의 가격 계산 부하를 최소화했습니다.',
          en: 'Minimized pricing computation load across product surfaces by reducing duplicate calls for the same product.',
        },
        {
          ko: '전 지면 게이트웨이 연계를 통해 가격 노출 정합성을 맞췄습니다.',
          en: 'Aligned price exposure consistency through company-wide gateway integration.',
        },
      ],
      note: {
        ko: '가격 계산 위치를 중앙 API로 모으고 DataLoader로 중복 계산 부하를 줄인 프로젝트입니다.',
        en: 'A project that centralized pricing into one API and reduced duplicate computation with DataLoader.',
      },
      tech: ['Kotlin', 'Spring Boot', 'DGS Framework', 'MySQL', 'QueryDSL', 'Resilience4j'],
    },
    {
      title: {
        ko: '멤버십/마일리지 서비스 이관 및 고도화',
        en: 'Membership & Mileage Migration',
      },
      period: {
        ko: '2023.04 - 2023.06',
        en: 'Apr 2023 - Jun 2023',
      },
      company: {
        ko: '카카오스타일',
        en: 'Kakao Style',
      },
      roleLabel: {
        ko: '레거시 Node.js 서비스를 Spring Boot로 무중단 이관',
        en: 'Migrated legacy Node.js services to Spring Boot with zero downtime',
      },
      summary: {
        ko:
          '리텐션 강화를 위해 멤버십 등급 체계를 재설계하고, cormo.js 기반 레거시를 Spring Boot로 무중단 이관했으며, 월별 등급 산정 배치 성능도 함께 높였습니다.',
        en:
          'Redesigned membership tiers for retention, migrated the cormo.js legacy service to Spring Boot without downtime, and improved monthly tier-calculation batch performance.',
      },
      challenge: {
        ko:
          '기존 cormo.js 기반 서비스를 1:1 DB 마이그레이션으로 옮기면서도 기존 동작을 유지해야 했고, 매달 전체 고객 사용액을 정산하는 멤버십 등급 배치의 부하도 함께 줄여야 했습니다.',
        en:
          'The project required a 1:1 DB migration from the cormo.js legacy service while preserving behavior, and also reducing the load of monthly membership tier batches that settle usage for all customers.',
      },
      actions: [
        {
          ko: 'cormo.js 기반 레거시를 Spring Boot로 1:1 DB 마이그레이션하며 무중단 전환했습니다.',
          en: 'Migrated the cormo.js legacy service to Spring Boot with a 1:1 DB migration and zero-downtime rollout.',
        },
        {
          ko: '멤버십 등급 산정 기간을 3개월에서 6개월로 확대하고 등급별 마일리지 적립 로직을 개발했습니다.',
          en: 'Expanded the membership tier calculation period from 3 to 6 months and developed tier-based mileage earn logic.',
        },
        {
          ko: '3개월 단위 등급 산정액 계산을 달별 캐시와 누적합 방식으로 최적화했습니다.',
          en: 'Optimized tier amount calculations with monthly caching and cumulative sums.',
        },
        {
          ko: '매달 전체 고객 사용액을 정산하는 배치 부하를 줄이기 위해 Athena, 스트림 기반 처리, 월간 파티션을 조합해 조회·적재 효율을 높였습니다.',
          en: 'Reduced monthly settlement batch load by combining Athena, stream-based processing, and monthly partitioning to improve query and load efficiency.',
        },
      ],
      outcomes: [
        {
          ko: '달별 캐시 도입으로 DB 부하를 임계치 70%에서 30% 이내로 낮췄습니다.',
          en: 'Reduced DB load from a 70% threshold to under 30% by introducing monthly caching.',
        },
        {
          ko: '통합 테스트와 게이트웨이 점진적 전환으로 기존 동작을 유지하며 무중단 배포를 성공시켰습니다.',
          en: 'Achieved zero-downtime deployment with integration tests and gradual gateway switching while preserving existing behavior.',
        },
        {
          ko: '대량 고객 데이터가 계속 적재되는 환경에서 월별 등급 산정 배치를 더 빠르게 처리할 수 있도록 최적화했습니다.',
          en: 'Optimized monthly tier-calculation batches to run faster in an environment where large customer datasets keep accumulating.',
        },
      ],
      note: {
        ko: '무중단 이관과 대량 고객 사용액 정산 배치 최적화를 함께 설명할 수 있는 프로젝트입니다.',
        en: 'A project that combines zero-downtime migration with optimization of high-volume monthly settlement batches.',
      },
      tech: ['Kotlin', 'Spring Boot', 'Spring Batch', 'DGS Framework', 'GraphQL', 'JPA', 'QueryDSL', 'MySQL', 'Kafka', 'AWS Athena'],
    },
  ],
};

export function portfolioText(value: Localized, lang: Lang) {
  return lang === 'en' ? value.en : value.ko;
}
