import type { Lang, Localized } from '@/lib/resume-types';

const multiPgArchitectureDiagram = `flowchart TD
  Req["pay / rePay<br/>order=ORD-240915-001<br/>user=421 method=17 point=2000"] --> Lock["distributed lock<br/>payment-user-process:421"]
  Lock --> Hold["PointUpdater.hold()<br/>wallet -> HOLD 2000P"]
  Hold --> Ready["createWithReady()<br/>payment READY"]
  Ready --> Sub["resolve subscription<br/>methodId=17 or primary"]
  Sub --> Vendor["PG Vendor Router<br/>supports: KakaoPay / TossPayments / Kakao T<br/>selected: Kakao T"]
  subgraph PGV["PG Vendor Layer"]
    direction TD
    Vendor --> Keys["read vendor keys<br/>pgPayKey + token"]
    Keys --> Api["vendor client.pay(...)"]
    Api --> Tx["save pgTransactionId<br/>paymentId / tid / paymentKey"]
  end
  Tx --> Result{"approval result"}
  Result -->|success| Done["updateSuccess<br/>payment PAID<br/>point HOLD->CONFIRM"]
  Result -->|fail| Fail["updateFailed<br/>releaseHold(order)"]
  Fail --> Recovery["repair / retry / failover"]
  classDef vendor fill:#dff2ff,stroke:#0f4c81,stroke-width:2px,color:#0f172a;
  class Vendor,Keys,Api,Tx vendor;
  style PGV fill:#eef7fb,stroke:#0f4c81,stroke-width:2px,color:#0f172a;`;

const multiVendorContractDiagram = `flowchart TD
  Vendors["VendorType<br/>KakaoPay / TossPayments / Kakao T"] --> Select["VendorChecker.select(vendorType)"]
  Select --> Required["Required on all vendors<br/>VendorPaymentProcessor<br/>VendorMethodProcessor"]
  Select --> Partial["Required on some vendors<br/>VendorPaymentOnceProcessor<br/>(KakaoPay only)"]
  Select --> Optional["Optional extensions<br/>RepairService / vendor hooks"]
  Required --> Validate["@RequiredVendor<br/>+ VendorRequirementsValidator"]
  Partial --> Validate
  Validate --> Boot{"startup validation"}
  Boot -->|missing| Error["application start fail"]
  Boot -->|ok| Route["route to concrete impl"]
  classDef core fill:#dff2ff,stroke:#0f4c81,stroke-width:2px,color:#0f172a;
  classDef optional fill:#edf9f3,stroke:#2f6f57,stroke-width:2px,color:#0f172a;
  classDef error fill:#fff1f2,stroke:#be123c,stroke-width:2px,color:#0f172a;
  class Vendors,Select,Required,Partial,Validate,Route core;
  class Optional optional;
  class Error error;`;

const kakaoTLinkAndCardDiagram = `flowchart TD
  User["VoltUp member<br/>encrypted CI"] --> OAuth["Kakao T OAuth<br/>external account + encrypted CI"]
  OAuth --> Link["user-service<br/>AuthMethod(KAKAO_T) link"]
  Link --> Session["FEAPP link session<br/>ACCOUNT + PAYMENT"]
  Session --> Ready["billing init<br/>READY 상태 전환"]
  Ready --> Active["confirm success<br/>ACTIVE 상태 전환"]`;

const vehiclePncDiagram = `flowchart TD
  Vehicle["vehicleInfo 501<br/>plate=12가3456"] --> Match{"unlinked pair<br/>count == 1 ?"}
  Pnc["userVehicle 88<br/>evccId=EVCC-A1B2"] --> Match
  Match -->|yes| Link["linkPncVehicle(501,88)"]
  Match -->|no| Manual["manual select"]
  Link --> Auth["authorizeByEvccId<br/>user=421 plate=12가3456"]
  Auth --> Charge["start charge"]`;

const voltupPointWalletDiagram = `flowchart TD
  Grant["addBulk / partner accrual<br/>BASE 1200P exp 10-18<br/>TOYOTA 3000P exp 10-20<br/>BLUEMEMBERS 800P exp 10-22<br/>NEXEN 5000P exp 10-31<br/>EVENT 700P exp 11-15<br/>BASE 900P exp null"] --> Rule["wallet rule<br/>expiredAt 있으면 new wallet<br/>null이면 same type+chargeType merge"]
  Rule --> Wallets["wallet #11 BASE/FREE 1200 exp 10-18<br/>wallet #12 TOYOTA/FREE 3000 exp 10-20<br/>wallet #13 BLUEMEMBERS/FREE 800 exp 10-22<br/>wallet #14 NEXEN/CHARGE 5000 exp 10-31<br/>wallet #15 EVENT/FREE 700 exp 11-15<br/>wallet #16 BASE/FREE 900 exp null"]
  Wallets --> Active["active wallet scan<br/>expiredAt > now only<br/>createdAt asc page 조회"]
  Active --> Order["deduction order<br/>FREE first<br/>then expiredAt asc"]
  Order --> Hold["hold 4500P<br/>#11 -1200<br/>#12 -3000<br/>#13 -300"]
  Hold --> Usage["point_usage rows<br/>order=ORD-240915-001<br/>walletId=11,12,13<br/>status=HOLD"]
  Usage --> Result{"payment result"}
  Result -->|success| Confirm["confirm<br/>HOLD -> CONFIRM<br/>wallet amount final"]
  Result -->|fail| Release["releaseHold(order)<br/>wallet 11 +1200<br/>wallet 12 +3000<br/>wallet 13 +300<br/>usage -> FAILED"]
  Wallets --> Expire["expiry handling<br/>expired wallet = active 제외<br/>expiringSoon 별도 조회"]
  classDef wallet fill:#dff2ff,stroke:#0f4c81,stroke-width:2px,color:#0f172a;
  classDef state fill:#edf9f3,stroke:#2f6f57,stroke-width:2px,color:#0f172a;
  class Wallets,Active,Order,Hold,Usage wallet;
  class Confirm,Release,Expire state;`;

const voltupCouponServiceDiagram = `flowchart TD
  Pack["couponPack 71<br/>register 10/01~10/31<br/>usable 10/01~11/30"] --> Code["batchIssue(size=1000)<br/>Snowflake -> SHA-256/base36<br/>code=37PRPT85WA"]
  Pack --> Direct["mapping(code=null) / batchMapping<br/>user=421 or [421,422]"]
  Code --> Claim["mapping(user=421, code=37PRPT85WA)<br/>lock coupon-mapping:37PRPT85WA"]
  Claim --> Guard["DB unique guard<br/>code / (userId,couponPackId)"]
  Direct --> Guard
  Guard --> Ready["coupon row<br/>userId=421 status=READY"]
  Ready --> Process["process(price=32000, user=421)<br/>lock coupon-process:421<br/>READY -> PROCESSING"]
  Process --> Finish["complete -> COMPLETE<br/>rollback -> READY"]
  Pack --> Expire["couponExpiryReminderJob<br/>usableEndAt D+3 window"]
  Expire --> Scan["getAllByCouponPackId<br/>completeAt is null"]
  Scan --> Event["publish coupon.event<br/>eventType=EXPIRED"]`;

const pricingPlatformDiagram = `flowchart TD
  Req["request<br/>product=421 user=3001 site=KR"] --> Match
  Req --> Member
  subgraph PIMSYS["상품 관리 시스템 (PIM)"]
    direction TD
    Match["외·내부 상품 매칭<br/>matchingId / same-shop / winner score"]
    Optimize["다이나믹 프라이싱<br/>price score / compare set"]
    Catalog["쇼핑 카탈로그 Engine Page<br/>Naver / YouTube feed sync"]
    External["외부 상품 값<br/>lowest price / sync dataset"]
    Match --> Optimize --> Catalog --> External
  end
  subgraph PROMO["프로모션 서비스 (Promotion)"]
    direction TD
    Member["Membership<br/>grade / eligibility"]
    Final["Final Pricing API<br/>coupon / promotion / shipping"]
    Member --> Final
  end
  External --> Expose
  Final --> Expose
  Expose["PIM 고객 노출 가격<br/>promotion final + external price"] --> Resp["response<br/>합리적 최적가 노출"]
  classDef pim fill:#fff4db,stroke:#9a6700,stroke-width:2px,color:#0f172a;
  classDef promo fill:#dff2ff,stroke:#0f4c81,stroke-width:2px,color:#0f172a;
  classDef expose fill:#edf9f3,stroke:#2f6f57,stroke-width:2px,color:#0f172a;
  class Match,Optimize,Catalog,External pim;
  class Member,Final promo;
  class Expose,Resp expose;`;

const devopsAutomationDiagram = `flowchart TD
  Pain["반복 작업<br/>PR 리뷰 / 로컬 ENV / 배포"] --> Review["voltup-workflow<br/>/gemini-review<br/>org reusable workflow"]
  Review --> Context["project-context + prompts + skills<br/>repo별 규칙 주입"]
  Pain --> Local["Gradle generateYamlAction<br/>application-local.yaml"]
  Local --> Vault["Vault CLI login<br/>project path + SHARED path<br/>secret commit 없음"]
  Local --> IAM["gcloud account -><br/>IAM_DB_USER_NAME"]
  Pain --> Deploy["Jenkins shared library<br/>job name -> target 분기"]
  Deploy --> Build["docker/app build<br/>cache / track / notifications"]
  Build --> Argo["deployArgoCD"]
  classDef ai fill:#fff4db,stroke:#9a6700,stroke-width:2px,color:#0f172a;
  classDef sec fill:#edf9f3,stroke:#2f6f57,stroke-width:2px,color:#0f172a;
  classDef ops fill:#dff2ff,stroke:#0f4c81,stroke-width:2px,color:#0f172a;
  class Review,Context ai;
  class Local,Vault,IAM sec;
  class Deploy,Build,Argo ops;`;

const membershipBatchPartitionDiagram = `flowchart TD
  Source["Athena source<br/>vip_confirmed_paid_partitioned<br/>stamp_date=2023-10-08"] --> Reader["reader paging<br/>queryExecutionId + nextToken"]
  Reader --> Paid["UserConfirmedPaid<br/>user=421 confirmed=330000<br/>predicted=350000"]
  Paid --> Calc["level calc<br/>최근 6개월 누적합 기준"]
  Calc --> Upsert["membership upsert<br/>dateAppliedYm=202310"]
  Upsert --> Current["memberships<br/>batch insert / update"]
  Upsert --> Archive["membership_logs<br/>RANGE(date_applied_ym)"]
  Current --> Query["recent Ym lookup<br/>202310, 202309, 202308"]
  Archive --> Query`;

const membershipParityMigrationDiagram = `flowchart TD
  Legacy["기존 멤버십 API<br/>request / response set 수집"] --> Cases["테스트 케이스화<br/>query / body / edge case"]
  Cases --> Replay["Spring Boot 로직에<br/>동일 입력 재주입"]
  Replay --> Compare{"legacy 응답과 동일?"}
  Compare -->|yes| Ready["배포 후보 확정"]
  Compare -->|no| Fix["로직 / serializer diff 수정"]
  Fix --> Replay
  Ready --> Switch["게이트웨이 점진 전환"]
  Switch --> Open["무중단 오픈"]`;

export interface PortfolioDiagramExample {
  title: Localized;
  steps: Localized[];
}

export interface PortfolioDiagram {
  title: Localized;
  description: Localized;
  code: string;
  example?: PortfolioDiagramExample;
}

export interface PortfolioReferenceImage {
  src: string;
  href?: string;
  title: Localized;
  caption?: Localized;
  alt: Localized;
}

export interface PortfolioProject {
  slug: string;
  externalUrl?: string;
  title: Localized;
  indexLabel?: Localized;
  referenceLayout?: 'stacked' | 'split-with-context';
  period: Localized;
  company: Localized;
  roleLabel: Localized;
  summary: Localized;
  challenge: Localized;
  actions: Localized[];
  engineeringViews: Localized[];
  outcomes: Localized[];
  note: Localized;
  tech: string[];
  subsections?: Array<{
    id: string;
    title: Localized;
    description: Localized;
  }>;
  diagrams?: PortfolioDiagram[];
  referenceImages?: PortfolioReferenceImage[];
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
    ko: '결제, 프라이싱, 멤버십, 프로모션, DX, 개인 서비스의 주요 사례',
    en: 'Selected cases across payments, pricing, membership, promotions, DX, and personal products',
  },
  intro: {
    ko:
      '경력기술서와 이력서에 정리한 프로젝트 가운데, 멀티 벤더 결제, 프라이싱 플랫폼, 멤버십 이관, 포인트 지갑 설계, DX 자동화, 그리고 Commit Map처럼 개인 문제를 제품으로 풀어본 사례를 골라 정리했습니다.',
    en:
      'This page highlights projects such as multi-vendor payments, pricing APIs, membership migration, point-wallet design, DX automation, and Commit Map as a personal product built from a real planning problem.',
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
      ko: 'Pub/Sub DLQ, Athena 배치, 월간 파티션, 서킷브레이커 기반 운영 안정화 경험',
      en: 'Operational stabilization with Pub/Sub DLQ, Athena batches, monthly partitions, and circuit-breaker patterns',
    },
    {
      ko: 'run-gemini-cli, Docusaurus, Firebase App Distribution, Jenkins/TestFlight 기반 DX 개선 경험',
      en: 'DX improvements using run-gemini-cli, Docusaurus, Firebase App Distribution, and Jenkins/TestFlight',
    },
  ],
  projects: [
    {
      slug: 'multi-pg-payment',
      title: {
        ko: '멀티 벤더 결제 시스템 및 정산 안정화',
        en: 'Multi-Vendor Payment System and Settlement Stabilization',
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
          '결제 서비스 초기 설계부터 구현까지 전담하며, 단일 결제 구조를 멀티 벤더사를 수용하는 모듈 구조로 확장하고, DLQ 기반 미수 이벤트 처리와 자동 복구 체계를 구성했습니다.',
        en:
          'Owned the payment service from initial design through implementation, expanding a single payment flow into a modular structure that supports multiple payment vendors and building DLQ-based unpaid-event processing with automatic recovery.',
      },
      challenge: {
        ko:
          '단일 결제 중심 구조에서 복수 벤더를 같은 방식으로 수용하고, 이후 새로운 벤더가 늘어나더라도 같은 확장 지점으로 붙일 수 있는 구조가 필요했습니다.',
        en:
          'The service needed to move beyond a single-payment structure into one that can absorb multiple payment vendors through the same extension point, while also handling unpaid-processing flows.',
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
      engineeringViews: [
        {
          ko: '결제 요청, 포인트 hold/confirm, 성공·실패 업데이트를 PaymentProcessor 중심으로 묶어 상태 전이를 한 곳에서 추적할 수 있게 설계했습니다.',
          en: 'Centered request orchestration, point hold/confirm, and success/failure transitions around PaymentProcessor so state changes remain traceable in one place.',
        },
        {
          ko: '같은 사용자의 중복 결제 시도가 포인트 hold를 동시에 건드리지 않도록, 유저 단위 락 안에서 hold와 payment READY 생성을 함께 처리했습니다.',
          en: 'Protected point holds from concurrent payment attempts by keeping both hold and payment-READY creation inside a user-scoped lock.',
        },
        {
          ko: 'PG 네트워크 불확실성은 repair, 컨슈머 재시도, failover 배치로 층을 나눠 즉시 복구와 운영 개입 경계를 분리했습니다.',
          en: 'Split PG-network uncertainty into repair, consumer retries, and failover batches so immediate recovery and operator intervention remain clearly separated.',
        },
      ],
      outcomes: [
        {
          ko: '복수 PG를 단일 인터페이스로 통합하고, 새로운 벤더가 추가돼도 같은 구조로 확장 가능한 결제 아키텍처를 만들었습니다.',
          en: 'Built a payment architecture that integrates multiple PG vendors behind one interface and remains extensible as new vendors are added.',
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
      diagrams: [
        {
          title: {
            ko: '멀티 벤더 결제 오케스트레이션: 락, hold, 상태 전이',
            en: 'Multi-vendor orchestration: lock, hold, and state transitions',
          },
          description: {
            ko:
              'PaymentProcessor 기준으로, 요청 데이터와 락 키, 포인트 hold, payment READY, `PG Vendor` 내부 승인 단계, 성공/실패 상태 전이가 한 장 안에서 자연스럽게 이어지도록 정리했습니다.',
            en:
              'Keeps request data, lock key, point hold, payment READY creation, internal `PG Vendor` approval steps, and success/failure transitions in one integrated diagram.',
          },
          code: multiPgArchitectureDiagram,
        },
        {
          title: {
            ko: '멀티 Vendor 시스템: 필수 계약과 선택 확장',
            en: 'Multi-vendor system: mandatory contracts and optional extensions',
          },
          description: {
            ko:
              '`VendorType` 확장 지점 위에 `VendorChecker.select()`를 두고, 모든 벤더에 필요한 계약과 특정 벤더에만 필요한 기능을 분리했습니다. `@RequiredVendor`와 `VendorRequirementsValidator`가 앱 시작 시 필수 구현 누락을 막고, `VendorPaymentOnceProcessor(KakaoPay)`나 repair 서비스는 필요한 벤더에만 붙도록 구성했습니다.',
            en:
              'Places `VendorChecker.select()` on top of the `VendorType` extension point, separates contracts required for every vendor from features needed by only some vendors, and uses `@RequiredVendor` plus `VendorRequirementsValidator` to catch missing mandatory implementations at startup.',
          },
          code: multiVendorContractDiagram,
        },
      ],
    },
    {
      slug: 'kakao-t-integration',
      title: {
        ko: '카카오 T 계정 링크 및 결제수단 등록',
        en: 'Kakao T Account Linking and Payment Method Registration',
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
        ko: '회원 식별 통합, AuthMethod 연결, 카드 등록 상태 설계',
        en: 'Unified member identity, linked AuthMethod records, and designed card registration state',
      },
      summary: {
        ko:
          'VoltUp 회원가입 이후 카카오T 외부 계정을 암호화된 CI 기준으로 연결하고, FEAPP 한 스텝 API에서 결제수단 등록 세션 생성부터 billing의 READY 상태 전환, ACTIVE 상태 전환까지 이어지는 흐름을 설계했습니다.',
        en:
          'Designed the flow that links Kakao T external accounts to existing VoltUp members through encrypted CI and carries payment-method registration from the FEAPP one-step API through billing READY-state and ACTIVE-state transitions.',
      },
      challenge: {
        ko:
          '기존 VoltUp 회원과 KakaoT 유저를 중복 계정 없이 합쳐야 했고, 그 위에서 카드 등록 세션과 최종 결제수단 상태가 같은 사용자 컨텍스트를 공유해야 했습니다.',
        en:
          'The system had to merge existing VoltUp members with Kakao T users without creating duplicate identities, then keep card-registration sessions and final payment-method state under the same user context.',
      },
      subsections: [
        {
          id: 'user-side-backend-overview',
          title: {
            ko: '유저 사이드 백엔드',
            en: 'User-side Backend',
          },
          description: {
            ko: '이력서의 유저 사이드 백엔드 항목은 카카오 T 연동을 중심으로 차량/PnC(Plug & Charge), 인증서 안정화 등 사용자 경험 핵심 흐름을 함께 다룬 이 영역으로 연결됩니다.',
            en: 'The resume entry for User-side Backend maps here as the broader area around Kakao T integration, vehicle/PnC (Plug & Charge) flows, and user-facing stability work.',
          },
        },
      ],
      actions: [
        {
          ko: 'KakaoT OAuth 결과의 `externalId`, `ci`를 기준으로 기존 VoltUp 회원을 찾고 `AuthMethod(KAKAO_T)`를 추가하는 연결 흐름을 설계했습니다.',
          en: 'Designed the linking flow that resolves the existing VoltUp member from Kakao T OAuth account data and encrypted CI, then adds `AuthMethod(KAKAO_T)`.',
        },
        {
          ko: 'FEAPP에서 현재 사용자의 암호화된 CI를 기준으로 KakaoT 결제수단 연동 세션을 생성하는 한 스텝 API 흐름을 정리했습니다.',
          en: 'Built the one-step FEAPP flow that uses the current user encrypted CI to create the Kakao T payment-link session.',
        },
        {
          ko: 'billing에서는 `pg_payloads`에 `session_key`를 저장하고, confirm 시 `pgPayKey`와 `t_partner_user_token`을 확정하는 상태 전이를 구현했습니다.',
          en: 'In billing, implemented the state transition that stores the `session_key` in `pg_payloads` and finalizes `pgPayKey` plus `t_partner_user_token` during confirm.',
        },
      ],
      engineeringViews: [
        {
          ko: 'auth는 외부 계정 정보 수집, user-service는 동일인 판단과 AuthMethod 소유권, billing은 결제수단 상태를 맡도록 경계를 분리했습니다.',
          en: 'Split responsibilities so auth owns external account acquisition, user-service owns identity resolution and AuthMethod ownership, and billing owns payment-method state.',
        },
        {
          ko: '회원 연결이 끝나기 전에는 카드 등록을 진행하지 않고, 연결 완료 후에만 session 생성과 activate를 진행해 사용자 식별 불일치를 막았습니다.',
          en: 'Prevented identity mismatches by not starting card registration until account linking is complete, then creating sessions and activate calls only afterward.',
        },
        {
          ko: '`READY -> ACTIVE` 전이에서 필요한 `session_key`, `partner_user_token`, `pgPayKey`를 같은 subscription 행에 모아 이후 승인/취소 호출도 재사용 가능하게 했습니다.',
          en: 'Grouped the `session_key`, `partner_user_token`, and `pgPayKey` around the same subscription row during the `READY -> ACTIVE` transition so later approve/cancel calls can reuse them.',
        },
      ],
      outcomes: [
        {
          ko: '기존 VoltUp 회원과 KakaoT 계정을 동일인 기준으로 연결한 뒤 카드 등록을 이어가는 사용자 흐름을 정리했습니다.',
          en: 'Established the user flow that links existing VoltUp members to Kakao T accounts before continuing into card registration.',
        },
        {
          ko: '결제수단 등록 완료 후 subscription이 ACTIVE 상태를 유지하며 승인, 취소, 조회가 같은 식별 컨텍스트를 재사용하도록 만들었습니다.',
          en: 'Made subscriptions stay in the ACTIVE state after registration so approve, cancel, and lookup operations can reuse the same identity context.',
        },
      ],
        note: {
          ko: '회원 식별 통합과 카드 등록 상태 전이를 함께 설명하기 좋은 프로젝트입니다.',
          en: 'A strong project for explaining both identity unification and payment-method state transitions.',
        },
        tech: ['Kotlin', 'Spring Boot', 'OAuth2', 'Flyway', 'T Partner API'],
        referenceImages: [
          {
            src: '/images/portfolio/voltup-multi-auth.png',
            title: {
              ko: '로그인 수단 연결: 동일 회원 아래 Kakao T 계정 연결',
              en: 'Linked auth methods: connecting Kakao T under the same member',
            },
            caption: {
              ko: '동일 사용자 기준으로 여러 로그인 수단을 묶고, Kakao T 계정 연결 이후 결제수단 등록 흐름으로 이어지도록 설계한 화면입니다.',
              en: 'A screen showing how multiple auth methods were unified under one member, then connected into the Kakao T payment-registration flow.',
            },
            alt: {
              ko: 'VoltUp 로그인 수단 연결 화면',
              en: 'VoltUp linked auth-method screen',
            },
          },
          {
            src: '/images/portfolio/voltup-add-payments.png',
            title: {
              ko: '결제수단 등록: Kakao T / 카카오페이 / 일반 카드 분기',
              en: 'Payment registration: Kakao T, KakaoPay, and card options',
            },
            caption: {
              ko: '추가하기 한 번으로 Kakao T, 카카오페이, 일반 카드 등록 경로를 한 바텀시트에서 노출해 사용자 선택 흐름을 단순화한 화면입니다.',
              en: 'A bottom-sheet entry that exposes Kakao T, KakaoPay, and normal card registration in one place to simplify the user choice flow.',
            },
            alt: {
              ko: 'VoltUp 결제수단 등록 바텀시트 화면',
              en: 'VoltUp payment-method registration bottom sheet',
            },
          },
        ],
        diagrams: [
          {
            title: {
              ko: 'VoltUp 회원과 Kakao T 계정 연결 후 카드 등록',
            en: 'Card registration after VoltUp-to-Kakao T account linking',
          },
          description: {
            ko:
              '회원 식별, 암호화된 CI 기준 계정 연결, link session 생성, READY 상태 전환과 ACTIVE 상태 전환 흐름을 한 번에 따라갈 수 있게 정리했습니다.',
            en:
              'Summarizes identity linking, encrypted-CI based account matching, link-session creation, and the READY-state to ACTIVE-state transition in one pass.',
          },
          code: kakaoTLinkAndCardDiagram,
        },
      ],
    },
    {
      slug: 'vehicle-pnc-auth',
      title: {
        ko: '차량 등록 / 차량 고유 키 자동 매핑 / PnC(Plug & Charge) 인증',
        en: 'Vehicle Registration, Vehicle-Key Auto-Mapping, and PnC (Plug & Charge) Authorization',
      },
      referenceLayout: 'split-with-context',
      period: {
        ko: '2025.07 - 현재',
        en: 'Jul 2025 - Present',
      },
      company: {
        ko: 'LG유플러스 볼트업',
        en: 'LG Uplus VoltUp',
      },
      roleLabel: {
        ko: '차량 정보 검증, 양방향 자동 매핑, PnC(Plug & Charge) 인증 흐름 설계',
        en: 'Designed vehicle verification, bidirectional auto-mapping, and PnC (Plug & Charge) authorization flows',
      },
      summary: {
        ko:
          '차량번호 기반 차량 정보와 바로충전용 차량 엔티티가 서로 다른 시점에 들어오는 구조에서, 매핑되지 않은 쌍이 정확히 1개일 때만 자동 연결하고 이후 PnC(Plug & Charge) 인증이 같은 차량 컨텍스트를 참조하도록 구성했습니다.',
        en:
          'Designed a flow where plate-number vehicle info and Plug & Charge vehicle entities arrive independently, auto-link only when exactly one unmatched pair exists, and then feed the same vehicle context into PnC (Plug & Charge) authorization.',
      },
      challenge: {
        ko:
          '차량 정보(`plateNumber`)와 바로충전 식별자(`evccId`)는 서로 다른 시점에 등록되기 때문에, 잘못된 자동 연결을 막으면서도 사용자가 매번 수동 선택하지 않도록 매핑 기준이 필요했습니다.',
        en:
          'Because vehicle info (`plateNumber`) and PnC (Plug & Charge) identifiers (`evccId`) are registered at different times, the system needed an auto-linking rule that avoids wrong matches without forcing users into manual selection every time.',
      },
      actions: [
        {
          ko: '차량 정보 등록과 PnC(Plug & Charge) 등록 양쪽에서 모두 “매핑 안 된 대상이 정확히 1개인지”를 검사하는 양방향 자동 매핑 규칙을 적용했습니다.',
          en: 'Applied a bidirectional auto-mapping rule that checks whether exactly one unmatched counterpart exists from both the vehicle-info and PnC (Plug & Charge) registration sides.',
        },
        {
          ko: '차량 정보는 `plateNumber`, PnC(Plug & Charge) 차량은 `evccId`를 중심으로 따로 저장하고, 연결 시점에만 `userVehicleInfo.userVehicleId`를 채우는 방식으로 상태를 분리했습니다.',
          en: 'Stored vehicle info around `plateNumber` and PnC (Plug & Charge) vehicles around `evccId`, then filled `userVehicleInfo.userVehicleId` only at link time to keep state transitions explicit.',
        },
        {
          ko: '이후 `authorizeByEvccId` 경로가 매핑된 차량 정보를 참조하도록 만들어, 충전기 인증 시에도 차량번호와 사용자 컨텍스트가 일관되게 이어지게 했습니다.',
          en: 'Made `authorizeByEvccId` resolve through the mapped vehicle so charger authorization can reuse the same plate-number and user context consistently.',
        },
      ],
      engineeringViews: [
        {
          ko: '자동 매핑은 편의 기능이지만 잘못 연결되면 위험하므로, “정확히 1개일 때만 연결”이라는 보수적 규칙으로 설계했습니다.',
          en: 'Auto-linking is a convenience feature with high downside risk, so it was designed conservatively: link only when there is exactly one unmatched counterpart.',
        },
        {
          ko: '차량 정보와 PnC(Plug & Charge) 엔티티를 동일 테이블에 억지로 합치지 않고 분리 저장한 뒤 링크로 결합해 등록 시점 차이를 자연스럽게 흡수했습니다.',
          en: 'Handled different registration timing naturally by storing vehicle info and PnC (Plug & Charge) entities separately and joining them through an explicit link instead of forcing them into one record early.',
        },
        {
          ko: '매핑 이후에는 `evccId -> userId/plateNumber` 조회가 가능해져 실제 충전 인증 경로가 데이터 모델 위에서 바로 설명되도록 만들었습니다.',
          en: 'After linking, `evccId -> userId/plateNumber` resolution becomes possible, making the real charging authorization path directly explainable from the data model.',
        },
      ],
      outcomes: [
        {
          ko: '차량 정보 등록과 바로충전 등록 어느 쪽을 먼저 하더라도 조건이 맞으면 자동 매핑되도록 정리했습니다.',
          en: 'Enabled auto-mapping from either direction so the system can link correctly whether vehicle info or PnC (Plug & Charge) registration happens first.',
        },
        {
          ko: 'PnC(Plug & Charge) 인증 시 `evccId`로 사용자를 식별하고 연결된 차량번호를 함께 참조하는 흐름을 운영 기준으로 만들었습니다.',
          en: 'Established an operational flow where PnC (Plug & Charge) authorization identifies the user by `evccId` and resolves the linked plate number together.',
        },
      ],
      note: {
          ko: '차량번호와 차량 고유 키가 언제 자동 연결되고 언제 수동 선택으로 넘겨야 하는지 설명하기 좋은 프로젝트입니다.',
          en: 'A good project for explaining when plate numbers and vehicle keys should auto-link and when the flow must fall back to manual choice.',
        },
    tech: ['Kotlin', 'Spring Boot', 'JPA', 'Redis'],
        referenceImages: [
          {
            src: '/images/portfolio/voltup-plug-and-charge.png',
            title: {
              ko: '차량 관리: 등록 차량과 바로충전 진입 화면',
              en: 'Vehicle management: registered car and Plug & Charge entry',
            },
            caption: {
              ko: '차량 등록 이후 바로충전(PnC) 기능으로 이어지는 사용자 화면 예시로, 차량 컨텍스트와 충전 인증 흐름이 서비스 안에서 어떻게 만나는지 보여줍니다.',
              en: 'A user-facing screen that leads from vehicle registration into Plug & Charge, showing how vehicle context and charging authorization meet in the product flow.',
            },
            alt: {
              ko: 'VoltUp 차량 등록 및 바로충전 화면',
              en: 'VoltUp vehicle registration and Plug & Charge screen',
            },
          },
        ],
        diagrams: [
          {
            title: {
              ko: '차량 정보와 차량 고유 키를 안전하게 자동 매핑하는 흐름',
              en: 'Safe auto-mapping flow between vehicle info and vehicle keys',
            },
            description: {
              ko:
                '차량 정보와 차량 고유 키 등록 예시 값을 노드에 직접 넣고, 자동 링크 조건과 최종 인증 결과까지 한 흐름 안에서 읽히게 했습니다.',
              en:
                'Embeds the vehicle and vehicle-key example values directly into the nodes so the auto-link condition and final authorization result read as one flow.',
            },
            code: vehiclePncDiagram,
          },
      ],
    },
    {
      slug: 'promotion-platform',
      title: {
        ko: '통합 프로모션(쿠폰/포인트) 플랫폼 구축 및 고도화',
        en: 'Unified Promotion Platform for Coupons and Points Buildout and Enhancement',
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
        ko: 'coupon-service 발급/매핑/만료 흐름과 포인트 지갑 구조 설계',
        en: 'Designed coupon-service issuance/mapping/expiry flows and point-wallet structure',
      },
      summary: {
        ko:
          'VoltUp `coupon-service`에서는 쿠폰팩의 등록 기간과 사용 기간을 기준으로 코드 발급, 코드 등록, 코드 없이 유저 직접 할당, 만료 알림 배치를 처리했고, 별도로 포인트는 accrual 단위 만료를 다루기 위해 지갑 구조와 차감 순서를 설계했습니다.',
        en:
          'In VoltUp `coupon-service`, handled code issuance, code registration, direct user assignment without codes, and expiry reminder batches based on coupon-pack registration and usage windows, while separately designing point wallets and redemption order for per-accrual expiration.',
      },
      challenge: {
        ko:
          '넥센, 도요타, 블루멤버스 등 제휴사별 요구사항을 수용하면서도, 쿠폰은 코드형 발급과 무코드 직접 할당을 같이 지원해야 했고, 포인트는 적립 건마다 다른 만료일을 가진 구조를 안정적으로 처리해야 했습니다.',
        en:
          'The project had to support partner-specific promotion requirements while handling both code-based coupon issuance and direct coupon assignment without codes, alongside a point model where each accrual can expire at a different date.',
      },
      actions: [
        {
          ko: '쿠폰은 `couponPack`에 `registerStartAt/registerEndAt`, `usableStartAt/usableEndAt`를 두고, 등록 가능 기간과 사용 가능 기간을 분리해 관리했습니다.',
          en: 'Managed coupons with separate `registerStartAt/registerEndAt` and `usableStartAt/usableEndAt` windows on `couponPack`, separating registration timing from usage timing.',
        },
        {
          ko: '코드형 쿠폰은 `batchIssue`에서 Snowflake 기반 ID를 SHA-256 후 base36 10자리 코드로 변환해 bulk 저장하고, 충돌 시 개별 저장 fallback으로 마무리했습니다.',
          en: 'Issued code-based coupons through `batchIssue`, converting Snowflake IDs into 10-character base36 codes after SHA-256 hashing, bulk-saving them first and falling back to individual saves on conflicts.',
        },
        {
          ko: '코드 없이 유저에게 바로 주는 경우에는 `mapping(code=null)` 또는 `batchMapping(userIds)`로 쿠폰 행을 직접 만들고, 코드 등록은 `coupon-mapping:{code}` 락 안에서 사용자와 연결했습니다.',
          en: 'For direct assignment without coupon codes, created coupon rows through `mapping(code=null)` or `batchMapping(userIds)`, while code registration linked the user inside a `coupon-mapping:{code}` lock.',
        },
        {
          ko: '포인트는 `addBulk`에서 `expiredAt`이 있으면 새 `PointWallet`을 만들고, 없으면 같은 `type + chargeType` 지갑에 합산해 적립 단위와 만료 단위를 함께 관리했습니다.',
          en: 'In `addBulk`, created a new `PointWallet` whenever `expiredAt` exists, while merging into the same `type + chargeType` wallet when it does not, so accrual and expiration units stay aligned.',
        },
        {
          ko: '포인트 사용 시에는 활성 지갑을 페이지 조회한 뒤 `FREE -> expiredAt 빠른 순`으로 정렬해 여러 wallet을 순차 hold하고, 실패 시에는 hold에 참여한 지갑만 정확히 복원했습니다.',
          en: 'When points are used, paged through active wallets and sorted them by `FREE -> earliest expiredAt`, holding across multiple wallets sequentially and restoring only the wallets that participated in the hold on failure.',
        },
        {
          ko: '쿠폰 만료는 `couponExpiryReminderJob`에서 `usableEndAt` 기준 윈도우를 읽어 `coupon.event`의 `EXPIRED` 이벤트를 발행하도록 했고, 포인트는 당월 만료분을 다음 달 히스토리 배치에 반영했습니다.',
          en: 'Handled coupon expiry through `couponExpiryReminderJob`, which reads a `usableEndAt` window and publishes `EXPIRED` events to `coupon.event`, while point expiration is reflected by the next-month history batch.',
        },
      ],
      engineeringViews: [
        {
          ko: '쿠폰은 `couponPack`이 기간과 할인 정책을 소유하고 개별 `coupon`이 유저 매핑과 사용 상태를 가지도록 나눠, 코드형/무코드형 발급을 같은 모델 안에서 처리했습니다.',
          en: 'Split coupon responsibilities so `couponPack` owns timing and discount policy while each `coupon` owns user mapping and usage state, allowing both code-based and code-less issuance within the same model.',
        },
        {
          ko: '코드 등록은 `coupon-mapping:{code}` 락, 사용 처리는 `coupon-process:{userId}` 락, DB는 `unique(code)`와 `unique(userId,couponPackId)`로 보강해 중복 등록과 중복 발급을 동시에 막았습니다.',
          en: 'Protected code registration with `coupon-mapping:{code}` locks, usage with `coupon-process:{userId}` locks, and reinforced both with `unique(code)` plus `unique(userId,couponPackId)` constraints to prevent duplicate registration and duplicate issuance.',
        },
        {
          ko: '만료는 별도 상태를 추가하기보다 `usableEndAt` 기준으로 만료 대상 쿠폰팩을 읽고, 미사용 쿠폰 사용자에게 `EXPIRED` 이벤트를 발행하는 배치 경로로 분리했습니다.',
          en: 'Handled expiry without adding another online coupon state: the batch reads coupon packs by `usableEndAt` and emits `EXPIRED` events only for unused assigned coupons.',
        },
        {
          ko: '포인트를 단일 잔액이 아닌 `PointWallets` 엔티티로 분리하고, `expiredAt`이 있는 적립은 새 wallet, 없는 적립은 동일 `type + chargeType` 지갑에 합산해 만료 규칙이 데이터 구조에 직접 드러나게 했습니다.',
          en: 'Split points into `PointWallets` entities instead of one balance, creating new wallets for expiring accruals and merging non-expiring ones into the same `type + chargeType` wallet so expiration rules are visible in the data model.',
        },
        {
          ko: '사용 시에는 활성 wallet을 읽어 `FREE -> expiredAt asc` 순으로 hold를 배분하고, `releaseHold(order)`는 실제 hold된 `pointWalletId`만 다시 찾아 복원하게 해서 순차 차감과 복구 기준을 일치시켰습니다.',
          en: 'During usage, distributed holds across active wallets in `FREE -> expiredAt asc` order, and made `releaseHold(order)` restore only the actually held `pointWalletId`s so deduction and recovery follow the same sequence.',
        },
      ],
      outcomes: [
        {
          ko: '코드형 쿠폰 발급, 코드 등록, 무코드 직접 할당, 만료 알림 배치를 `coupon-service` 안에서 같은 모델로 운영할 수 있게 정리했습니다.',
          en: 'Organized code issuance, code registration, direct assignment without codes, and expiry reminder batches under the same `coupon-service` model.',
        },
        {
          ko: '포인트 지갑, 만료 순서 차감, 다음 달 히스토리 배치 반영도 함께 운영해 쿠폰과 포인트를 하나의 프로모션 백엔드에서 설명할 수 있게 했습니다.',
          en: 'Kept point wallets, expiration-order redemption, and next-month history batching in the same backend so coupons and points can be explained together as one promotion platform.',
        },
      ],
      note: {
        ko: '쿠폰 서비스의 코드 발급/무코드 할당/만료 알림과 포인트 지갑 차감 구조를 함께 설명하기 좋은 프로젝트입니다.',
        en: 'A good project for explaining coupon-service issuance, direct assignment, expiry reminders, and point-wallet redemption structure together.',
      },
      tech: ['Kotlin', 'Spring Boot', 'Spring Batch', 'MySQL', 'JPA', 'QueryDSL', 'JDBC', 'Distributed Lock'],
      diagrams: [
        {
          title: {
            ko: 'coupon-service: 코드 발급, 무코드 할당, 만료 알림',
            en: 'coupon-service: code issuance, direct assignment, and expiry reminders',
          },
          description: {
            ko:
              '쿠폰팩 기준으로 코드 발급, 유저 코드 등록, 코드 없이 직접 할당, `usableEndAt` 기반 만료 알림 배치까지 실제 `coupon-service` 흐름을 한 장으로 정리했습니다.',
            en:
              'Shows the actual `coupon-service` flow from coupon-pack based code issuance and code registration to direct assignment without codes and `usableEndAt`-based expiry reminder batches.',
          },
          code: voltupCouponServiceDiagram,
        },
        {
          title: {
            ko: '포인트 지갑: 제휴별 적립과 만료일 순차 차감',
            en: 'Point wallets: partner accrual and expiration-ordered deduction',
          },
          description: {
            ko:
              '쿠폰 흐름과 분리해서, 여러 제휴 포인트가 wallet으로 쪼개지고 활성 지갑 조회 -> 정렬 -> hold -> confirm/release로 어떻게 관리되는지 예시 데이터와 함께 보여줍니다.',
            en:
              'Separates point handling from coupon flow and shows, with concrete example data, how partner points split into wallets and move through active-wallet scan, ordering, hold, and confirm/release.',
          },
          code: voltupPointWalletDiagram,
        },
      ],
    },
    {
      slug: 'devops-automation',
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
        ko: 'AI 리뷰 워크플로우, Vault-로컬 환경 동기화, Jenkins/ArgoCD 표준화',
        en: 'Standardized AI review workflows, Vault-to-local environment sync, and Jenkins/ArgoCD delivery',
      },
      summary: {
        ko:
          '볼트업 조직에서 반복적으로 발생하던 PR 리뷰, 로컬 환경 셋업, 서비스 배포 작업을 공통 workflow로 묶었습니다. 특히 로컬 환경값은 공개 저장소에 둘 수도 없고 개별 전달도 번거로워서, Vault 값을 `application-local.yaml`로 바로 동기화하는 Gradle 로직을 만들어 키가 추가될 때도 개발자 간 로컬 설정이 자동으로 같은 기준을 유지하도록 했고 Jenkins/ArgoCD 파이프라인까지 함께 표준화했습니다.',
        en:
          'Turned recurring PR review, local environment setup, and delivery work in Voltup into shared workflows. In particular, I built Gradle logic that syncs Vault values directly into `application-local.yaml`, so newly added keys stay aligned across developers automatically, then standardized Jenkins/ArgoCD delivery around the same operating model.',
      },
      challenge: {
        ko:
          'MSA가 늘수록 코드 리뷰 기준, 마이크로서비스별 작업 컨벤션, 반복 작업 방식, 로컬 환경값 전달, 배포 절차가 사람마다 달라지기 쉬웠습니다. 특히 환경값은 보안상 공개 저장소에 둘 수 없고, 그렇다고 매번 사람 손으로 따로 전달하는 것도 운영 비용이 컸습니다.',
        en:
          'As the number of services grew, review rules, microservice-level working conventions, recurring task patterns, local secret delivery, and deployment steps were drifting per person. The hardest part was local environment setup: secrets could not live in a public repo, but handing them out manually every time also created too much operational cost.',
      },
      actions: [
        {
          ko: '`voltup-workflow`에 `/gemini-review` 댓글 트리거형 GitHub Actions 워크플로우를 만들고, Organization Secret의 `GEMINI_API_KEY`와 저장소별 `project-context`, `review-template`, `docs`를 읽어 재사용 가능한 1차 코드 리뷰 체계를 구성했습니다.',
          en: 'Built a reusable comment-triggered GitHub Actions workflow in `voltup-workflow` around `/gemini-review`, using the organization-level `GEMINI_API_KEY` plus per-repo `project-context`, `review-template`, and docs to provide consistent first-pass reviews.',
        },
        {
          ko: 'MSA 저장소에는 `.agent/workflows`, `.github/skills`, `.github/prompts`, `copilot-instructions.md`를 넣어 각 마이크로서비스의 작업 컨벤션, 공통 작업 형상, API 우선 개발 흐름, 보안 규칙을 도구가 바로 이해할 수 있는 재사용 스킬 체계로 정리했습니다.',
          en: 'Added `.agent/workflows`, `.github/skills`, `.github/prompts`, and `copilot-instructions.md` to the MSA workspace so microservice conventions, recurring task shapes, API-first development flow, and security rules become reusable tool-readable skills instead of tribal knowledge.',
        },
        {
          ko: '루트 `build.gradle.kts`에는 base yaml의 placeholder를 Vault에서 치환해 `application-local.yaml`을 생성하는 로직을 넣고, 프로젝트 경로와 `secret/SHARED/voltup/dev`를 순차 조회하도록 만들었습니다. Vault CLI 로그인 확인, 비대화형 환경 대응, `gcloud` 계정 기반 `IAM_DB_USER_NAME` 치환까지 포함해 새 키가 추가돼도 개발자별 local 환경이 자동으로 같은 기준을 유지하도록 했습니다.',
          en: 'Added root `build.gradle.kts` logic that replaces base-yaml placeholders from Vault and generates `application-local.yaml`, checking both project-specific paths and `secret/SHARED/voltup/dev`. It also verifies Vault CLI login, handles non-interactive environments, and fills `IAM_DB_USER_NAME` from the current `gcloud` account so local environments stay automatically aligned across developers even when new keys are added.',
        },
        {
          ko: '`feapp-domain-service`에는 인증서와 `conf.json`을 Base64 인코딩해 Vault에 반영하는 `updateCodefCertificatesToVault` 태스크를 만들어, 민감 파일을 저장소나 메신저로 공유하지 않고도 필요한 개발자가 스스로 갱신할 수 있게 했습니다.',
          en: 'Added an `updateCodefCertificatesToVault` task in `feapp-domain-service` that Base64-encodes certificates and `conf.json` fields into Vault, so developers can refresh sensitive assets themselves without sharing files through the repo or chat.',
        },
        {
          ko: '배포는 `devops-cicd` Jenkins shared library 위에서 서비스별 `Jenkinsfile`이 job name으로 API/BATCH/CONSUMER/APP target을 분기하고, Docker build/push 후 ArgoCD 배포로 이어지도록 통일했습니다. Android 앱은 cache, track 선택, 알림까지 같은 패턴으로 자동화했습니다.',
          en: 'Standardized delivery on top of the `devops-cicd` Jenkins shared library so each service `Jenkinsfile` routes API/BATCH/CONSUMER/APP targets by job name and continues into Docker build/push plus ArgoCD deploy. The Android app pipeline follows the same pattern with cache restore/save, release track selection, and notifications.',
        },
      ],
      engineeringViews: [
        {
          ko: 'AI 도입을 “모델 하나 붙이기”가 아니라 재사용 가능한 workflow와 repo-local context를 설계하는 문제로 보고, 프로젝트별 문맥을 자동 리뷰 품질에 직접 연결했습니다.',
          en: 'Treated AI adoption as a workflow-and-context design problem rather than just attaching a model, tying repo-local knowledge directly to review quality.',
        },
        {
          ko: '로컬 환경 셋업은 “누가 비밀값을 전달하느냐”보다 “Vault와 local 환경을 직접 동기화해 인증된 개발자가 같은 기준의 설정을 자동으로 받게 하자”는 방향으로 풀었습니다. 공개 저장이나 수동 배포 대신 Vault CLI 인증을 전제로 yaml 생성과 인증서 갱신을 자동화해, 키가 늘어나도 개발자 간 동기화가 흐트러지지 않도록 만들었습니다.',
          en: 'Approached local setup as “sync Vault directly into local environments so authenticated developers receive the same baseline automatically” rather than “who hands secrets out.” By automating yaml generation and certificate refresh behind Vault CLI authentication, the workflow keeps developer environments aligned even as new keys are added.',
        },
        {
          ko: '배포 파이프라인은 서비스별로 완전히 다르게 두지 않고 job name 기반 target 분기와 shared library 위로 수렴시켜, 운영 절차를 공통화하면서도 앱/백엔드 차이는 target 수준에서만 드러나게 했습니다.',
          en: 'Converged delivery onto a shared-library model with job-name-based target routing so operational steps stay standardized while app/backend differences appear only at the target layer.',
        },
        {
          ko: '반복 작업이 팀 운영 리스크가 된다고 느낀 지점에서는 문서만 남기지 않고 직접 Gradle 태스크, workflow, Jenkins 파이프라인으로 만들어 팀이 바로 쓸 수 있게 바꿨습니다.',
          en: 'When repetitive work started becoming an operational risk, I did not stop at documentation alone; I turned it into Gradle tasks, reusable workflows, and Jenkins pipelines the team could use immediately.',
        },
      ],
      outcomes: [
        {
          ko: '조직 공통 AI 리뷰 워크플로우와 마이크로서비스별 컨벤션·공통 작업 형상 스킬 체계를 만들어, 신규 저장소나 신규 작업도 같은 기준으로 빠르게 온보딩할 수 있게 했습니다.',
          en: 'Established an organization-wide AI review workflow plus a skill system for microservice conventions and recurring task shapes, so new repos and workstreams can be onboarded under the same standards much faster.',
        },
        {
          ko: '민감한 환경값을 저장소에 두지 않으면서도 Vault와 local 환경을 바로 동기화해, 키가 추가될 때도 개발자 간 설정 sync가 자동으로 유지되도록 만들었습니다.',
          en: 'Kept sensitive values out of the repository while syncing Vault directly into local environments, so developer configs stay aligned automatically even as new keys are introduced.',
        },
        {
          ko: 'Jenkins shared library와 ArgoCD 중심 배포 패턴으로 서비스/앱 배포 절차를 단순화하고 수작업 분기를 줄였습니다.',
          en: 'Simplified service and app delivery with Jenkins shared-library plus ArgoCD deployment patterns, reducing manual branching in release operations.',
        },
      ],
      note: {
        ko: '보안 때문에 공개할 수 없는 로컬 환경값 문제를 Vault-local sync 구조로 풀어, 키 변경이 생겨도 개발자 간 설정이 자동으로 맞춰지게 만들고 그 흐름을 AI workflow와 배포 파이프라인까지 연결한 DX/DevOps 프로젝트입니다.',
        en: 'A DX/DevOps project centered on a Vault-to-local sync model that keeps developer configs aligned automatically as keys change, then connects that flow to AI workflows and delivery pipelines.',
      },
      tech: ['Vault CLI', 'Gradle Kotlin DSL', 'GitHub Actions', 'Jenkins', 'ArgoCD', 'Gemini API', 'GitHub Copilot', 'Claude Code', 'gcloud CLI'],
      diagrams: [
        {
          title: {
            ko: 'AI 리뷰, Vault-로컬 동기화, 배포 표준화',
            en: 'AI review, Vault-to-local sync, and deployment standardization',
          },
          description: {
            ko:
              '반복 작업을 발견한 뒤 AI 리뷰 workflow, Vault-local 동기화 기반 yaml 생성, Jenkins/ArgoCD 배포 표준화로 나눈 구조를 한 장에 정리했습니다.',
            en:
              'Summarizes how repeated work was turned into three tracks: AI review workflows, Vault-to-local sync based yaml generation, and Jenkins/ArgoCD deployment standardization.',
          },
          code: devopsAutomationDiagram,
        },
      ],
    },
    {
      slug: 'pricing-platform',
      title: {
        ko: '프라이싱 플랫폼: 상품 관리 시스템과 프로모션 서비스',
        en: 'Pricing Platform: Product Management System and Promotion Service',
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
        ko: 'PIM과 프로모션을 분리해 고객 노출 최적가 흐름 설계',
        en: 'Designed the customer-facing best-price flow across PIM and Promotion',
      },
      summary: {
        ko:
          '상품 관리 시스템(PIM)은 외·내부 상품 매칭, 다이나믹 프라이싱, 쇼핑 카탈로그 Engine Page를 담당하고 프로모션 서비스는 멤버십과 파이널 프라이싱을 담당하도록 경계를 나눠, 프로모션의 최종 혜택가와 외부 상품 값을 함께 비교해 고객에게 노출할 합리적 최적가를 계산하도록 정리한 프로젝트입니다.',
        en:
          'Split the boundary so PIM owns internal/external product matching, dynamic pricing, and shopping-catalog Engine Pages while Promotion owns membership and Final Pricing, allowing the user-facing best price to be chosen by comparing promotion-calculated benefit prices against external market prices.',
      },
      challenge: {
        ko:
          '외부 상품 가격, 내부 최적화 점수, 멤버십·쿠폰 혜택처럼 가격 결정 요소가 여러 서비스에 흩어져 있던 상태에서, 운영 정책은 자주 바뀌고 고객에게는 일관된 합리적 최적가를 보여줘야 했기 때문에 PIM과 프로모션의 책임을 나누면서도 한 흐름으로 연결할 구조가 필요했습니다.',
        en:
          'Price drivers such as external market prices, internal optimization signals, and membership or coupon benefits were spread across multiple services, while operating policies kept changing. The system needed a structure that separated PIM from Promotion yet still produced a consistent and rational best price for users.',
      },
      subsections: [
        {
          id: 'pricing-platform-product-matching',
          title: {
            ko: 'N:M 동일 상품 매칭',
            en: 'N:M Identical Product Matching',
          },
          description: {
            ko: '이미지 유사도, same-shop exact match, winner score를 기반으로 비교 가능한 상품군을 안정적으로 만드는 상품 매칭 영역입니다.',
            en: 'This covers product matching that stabilizes comparable groups through image similarity, same-shop exact matches, and winner scores.',
          },
        },
        {
          id: 'pricing-platform-final-pricing',
          title: {
            ko: '파이널 프라이싱 (각 서비스별 가격 계산 로직 통합 API)',
            en: 'Final Pricing (Unified API for Service-Level Pricing Logic)',
          },
          description: {
            ko: '멤버십·쿠폰·프로모션·배송비를 포함한 혜택가를 하나의 파이널 프라이싱 API로 표준화한 영역입니다.',
            en: 'This covers the Final Pricing API that standardizes membership, coupon, promotion, and shipping-adjusted benefit prices.',
          },
        },
        {
          id: 'pricing-platform-shopping-catalog',
          title: {
            ko: '쇼핑 카탈로그 Engine Page 및 최저가 갱신 (네이버쇼핑 / 유튜브쇼핑)',
            en: 'Shopping Catalog Engine Page & Lowest-Price Updates (Naver Shopping / YouTube Shopping)',
          },
          description: {
            ko: '변경 상품만 추려 Engine Page, 쇼핑 피드 CSV, 동기화 데이터셋을 빠르게 생성하는 쇼핑 연동 영역입니다.',
            en: 'This covers shopping integration that generates Engine Page outputs, feed CSVs, and sync datasets from changed items only.',
          },
        },
      ],
      actions: [
        {
          ko: '상품 관리 시스템의 상품 매칭은 version cache 기준으로 `productId -> matchingId`를 조회하고, 같은 shop의 exact match와 winner score를 묶어 프라이싱 기준 상품군을 정리했습니다.',
          en: 'Used versioned product-matching caches in PIM to resolve `productId -> matchingId`, then grouped exact same-shop matches with winner scores as the basis for pricing comparison.',
        },
        {
          ko: '가격 최적화는 Athena 적용 대상을 읽어 내부/외부 상품을 다시 구성하고, `SUPERIOR / EQUAL = 100`, `UNKNOWN = 50` 규칙으로 price score를 upsert하는 배치 흐름을 운영했습니다.',
          en: 'Ran price-optimization batches that read Athena-applied targets, rebuilt internal/external comparison sets, and upserted price scores with rules such as `SUPERIOR / EQUAL = 100` and `UNKNOWN = 50`.',
        },
        {
          ko: '쇼핑 카탈로그 영역은 상품 업데이트·가격 업데이트 이벤트를 받아 변경 상품만 추려 Engine Page, 쇼핑 피드 CSV, 동기화 데이터셋을 생성하는 공통 경로로 운영했습니다.',
          en: 'Built a shared shopping-catalog path that consumes product and price update events, filters only changed items, and generates Engine Pages, feed CSVs, and sync datasets.',
        },
        {
          ko: '프로모션 서비스에서는 멤버십 혜택 조건과 `product / item / order final price` API를 나누고, shipping fee는 `MappedBatchLoader`로 묶어 최종 혜택가를 조합했습니다.',
          en: 'Separated membership eligibility and `product / item / order final price` APIs in Promotion, then composed shipping fees through a `MappedBatchLoader` into the final benefit price.',
        },
      ],
      engineeringViews: [
        {
          ko: '상품 관리 시스템은 외·내부 상품 매칭, 다이나믹 프라이싱, 쇼핑 카탈로그를 운영하고 프로모션 서비스는 멤버십과 파이널 프라이싱을 담당하도록 경계를 나눠, PIM이 프로모션의 최종 혜택가와 외부 상품 값을 함께 비교해 고객 노출 최적가를 결정하도록 했습니다.',
          en: 'Split the boundary so PIM owns internal/external matching, dynamic pricing, and shopping catalogs while Promotion owns membership and Final Pricing, allowing PIM to determine the user-facing best price by comparing promotion-calculated benefit prices against external product values.',
        },
        {
          ko: '상품 매칭은 version cache와 same-shop exact match 기준을 사용해 비교 가능한 상품군을 먼저 안정화했고, winner score를 함께 노출해 운영 판단 근거도 남겼습니다.',
          en: 'Stabilized comparable product groups first through versioned caches and same-shop exact matching, while exposing winner-score context for operational decisions.',
        },
        {
          ko: '전체 상품을 매번 다시 읽어 변경값을 보내던 흐름 대신, 상품 업데이트와 가격 업데이트 이벤트를 받아 변경 상품만 추려 Engine Page와 네이버 쇼핑이 읽는 CSV·동기화용 데이터셋을 만드는 공통 경로로 바꿔 CPS 2시간 갱신 기준을 맞추고, 같은 구조를 구글 Engine Page(유튜브 쇼핑)에도 빠르게 확장할 수 있게 했습니다.',
          en: 'Replaced the flow that re-read the entire catalog on every run with a shared path that consumes product and price update events, filters only changed items, and generates the Engine Page plus the Naver Shopping feed CSV and sync dataset, meeting the CPS 2-hour refresh interval and making it quick to extend the same structure to Google Engine Page (YouTube Shopping).',
        },
        {
          ko: '파이널 프라이싱은 `product / item / order` 경계를 분리하고, 멤버십·쿠폰·프로모션·배송비를 한 응답 안에서 조합하면서도 shipping 조회 비용은 DataLoader로 제어했습니다.',
          en: 'Separated final pricing by `product / item / order` boundary and combined membership, coupons, promotions, and shipping in one response while controlling shipping-query cost through DataLoader.',
        },
      ],
      outcomes: [
        {
          ko: '상품 관리 시스템이 프로모션의 파이널 프라이싱 값과 외부 상품 값을 함께 받아 고객 노출 최적가를 계산하도록 구조를 정리했습니다.',
          en: 'Structured the system so PIM can combine Promotion Final Pricing values with external product prices to calculate the user-facing best price.',
        },
        {
          ko: '전체 상품 갱신에 기대면 약 6시간이 걸리던 구조에서, 변경 상품만 이벤트 기반으로 반영하는 경로를 추가해 네이버 쇼핑용 CSV와 동기화 데이터셋을 1시간 이내에 생성할 수 있게 했습니다.',
          en: 'Instead of depending on a full-catalog refresh that took about 6 hours, added an event-driven path for changed items so the Naver Shopping feed CSV and sync dataset can be generated within an hour.',
        },
        {
          ko: '네이버 쇼핑 기준으로 만든 Engine Page·최저가 갱신 구조를 공통화해 구글 Engine Page(유튜브 쇼핑)도 빠르게 반영할 수 있는 확장 기반을 마련했습니다.',
          en: 'Commonized the Engine Page and lowest-price update structure built for Naver Shopping so Google Engine Page (YouTube Shopping) could be added quickly on top of the same foundation.',
        },
        {
          ko: '상품, 아이템, 주문 단위의 파이널 프라이싱 응답을 표준화해 멤버십·쿠폰·프로모션 혜택가를 여러 지면과 운영 배치에서 같은 계약으로 재사용할 수 있게 했습니다.',
          en: 'Standardized final-pricing responses across product, item, and order boundaries so membership, coupon, and promotion-adjusted prices can be reused under one contract across surfaces and operational batches.',
        },
        {
          ko: '상품 관리 시스템 쪽 정책이 바뀌어도 그쪽 입력과 운영 로직만 조정하고, 프로모션 서비스의 사용자 응답 계약은 안정적으로 유지할 수 있게 했습니다.',
          en: 'Made it possible to change policies inside the product-management system while keeping the user-facing response contract in the promotion service stable.',
        },
      ],
      note: {
        ko: 'PIM이 외부 상품 값과 프로모션의 파이널 프라이싱 값을 함께 받아 고객에게 보여줄 합리적 최적가를 노출하도록 만든 서비스 경계를 설명하기 좋은 프로젝트입니다.',
        en: 'A strong project for explaining the boundary where PIM combines external product values with Promotion Final Pricing to expose a rational best price to users.',
      },
      tech: ['Kotlin', 'Spring Boot', 'DGS Framework(GraphQL)', 'AWS Athena'],
      diagrams: [
        {
          title: {
            ko: '상품 관리 시스템에서 프로모션 서비스까지 이어지는 프라이싱 흐름',
            en: 'Pricing flow from the product-management system to the promotion service',
          },
          description: {
            ko:
              'PIM은 외·내부 상품 매칭, 다이나믹 프라이싱, 쇼핑 카탈로그를 담당하고 프로모션 서비스는 멤버십과 파이널 프라이싱을 담당한 뒤, PIM이 프로모션의 최종 혜택가와 외부 상품 값을 함께 비교해 고객 노출 최적가를 만드는 구조를 한 장으로 정리했습니다.',
            en:
              'Shows in one diagram how PIM owns internal/external matching, dynamic pricing, and shopping catalogs while Promotion owns membership and Final Pricing, then how PIM combines promotion-calculated benefit prices with external product values to expose the best user-facing price.',
          },
          code: pricingPlatformDiagram,
        },
      ],
    },
    {
      slug: 'commit-map',
      externalUrl: 'https://map.dongholab.com/posts/2026-01-01-mie-nara-osaka/',
      title: {
        ko: 'Commit Map',
        en: 'Commit Map',
      },
      indexLabel: {
        ko: 'Commit Map (지도 기반 여행 계획 서비스)',
        en: 'Commit Map (Map-based travel planner)',
      },
      period: {
        ko: '운영 중',
        en: 'Ongoing',
      },
      company: {
        ko: '개인 프로젝트',
        en: 'Personal Project',
      },
      roleLabel: {
        ko: '자연어 여행 루트를 구조화된 지도 콘텐츠로 바꾸는 작성 플로우 설계',
        en: 'Designed an authoring flow that turns natural-language travel routes into structured map content',
      },
      summary: {
        ko:
          '개인 여행 계획을 지인과 공유하려고 만든 지도 기반 여행 계획 서비스입니다. 여행지와 이동 루트를 자연어로 적으면 AI 워크플로우가 일정 초안을 만들고, 이후 Markdown으로 직접 세부 동선을 고도화할 수 있게 구성했습니다.',
        en:
          'A map-based travel planning service built to share personal itineraries with friends. Natural-language destinations and routes are turned into a rough itinerary draft through an AI workflow, then refined manually in Markdown.',
      },
      challenge: {
        ko:
          '여행 계획은 메신저 대화, 지도 링크, 메모가 흩어지기 쉬워 공유와 수정이 번거롭고, 처음부터 장소 좌표와 일정 구조를 모두 수작업으로 넣는 것도 비용이 컸습니다.',
        en:
          'Travel plans tend to scatter across chat messages, map links, and notes, making them hard to share and revise, while manually structuring locations and coordinates from scratch also costs too much effort.',
      },
      actions: [
        {
          ko: 'Astro + React + Leaflet으로 여행 카드, 상세 지도, 타임라인을 결합한 정적 웹 서비스를 만들고, 장소 타입·순서·방문일 기준으로 동선을 시각화했습니다.',
          en: 'Built a static web service with Astro, React, and Leaflet that combines travel cards, detailed maps, and timelines, visualizing routes by place type, order, and visit date.',
        },
        {
          ko: '여행 포스트를 Markdown frontmatter와 location 스키마로 관리해, 일정·좌표·노트·링크를 구조화된 데이터로 다루고 추후 수동 수정이 쉬운 형태로 유지했습니다.',
          en: 'Managed trip posts through Markdown frontmatter and a location schema so dates, coordinates, notes, and links remain structured and easy to refine manually later.',
        },
        {
          ko: '프로젝트에 포함한 AI 워크플로우로 여행지와 이동 루트를 자연어로 입력하면 초안 포스트, 장소 후보, 기본 일정 구성을 빠르게 만들고, 이후 제가 직접 세부 계획과 콘텐츠를 고도화하는 플로우로 설계했습니다.',
          en: 'Added an AI workflow so natural-language destinations and routes can quickly produce a draft post, candidate places, and a starter itinerary, after which I refine the plan and content manually.',
        },
        {
          ko: 'GitHub Pages 기반 정적 배포로 운영해 여행 계획 링크를 바로 공유할 수 있게 하고, 특정 여행 포스트를 URL 단위로 바로 전달할 수 있게 구성했습니다.',
          en: 'Deployed it statically on GitHub Pages so travel plans can be shared instantly, with each trip post addressable by its own URL.',
        },
      ],
      engineeringViews: [
        {
          ko: 'AI는 완성본을 대신 쓰게 하기보다, 처음 루트를 잡아주는 초안 생성기로 두고 최종 계획의 진실은 Markdown 데이터에 남기도록 설계했습니다.',
          en: 'Treated AI not as the final planner but as a draft generator for the first route pass, while keeping the source of truth in Markdown data.',
        },
        {
          ko: '여행 콘텐츠는 글만 있는 블로그보다 지도, 타임라인, 장소 데이터가 함께 보여야 공유 가치가 높다고 보고, 시각화와 데이터 구조를 한 흐름으로 묶었습니다.',
          en: 'Viewed travel content as more valuable when maps, timelines, and location data are shown together rather than as text-only blog posts, so visualization and data structure were designed as one flow.',
        },
        {
          ko: '개인 프로젝트여도 운영 부담이 커지지 않도록 정적 배포와 콘텐츠 파일 기반 운영으로 유지비를 낮추고, 필요한 부분만 점진적으로 확장할 수 있게 했습니다.',
          en: 'Kept operating cost low with static deployment and file-based content so the personal project stays lightweight and can grow only where needed.',
        },
      ],
      outcomes: [
        {
          ko: '여행 계획을 메신저 조각 대신 링크 하나로 공유할 수 있는 개인 서비스로 운영하고 있습니다.',
          en: 'Operates as a personal service where itineraries can be shared through a single link instead of scattered messages.',
        },
        {
          ko: '여행지와 이동 루트만 적어도 AI 워크플로우가 초안 계획을 빠르게 만들어주고, 이후 직접 세부 동선을 고도화할 수 있는 작성 흐름을 만들었습니다.',
          en: 'Built an authoring flow where just listing destinations and routes is enough for the AI workflow to produce a starter plan that can later be refined in detail.',
        },
        {
          ko: '지도, 타임라인, 장소 메타데이터를 같은 콘텐츠 모델로 묶어, 여행 기록과 향후 여행 계획을 같은 방식으로 운영할 수 있게 했습니다.',
          en: 'Unified maps, timelines, and location metadata under one content model so both past trips and future plans can be operated in the same way.',
        },
      ],
      note: {
        ko: '취미 프로젝트이지만, 자연어 입력 → 구조화된 초안 → 사람이 고도화하는 워크플로우를 실제 서비스 형태로 풀어본 사례입니다.',
        en: 'Although it started as a hobby project, it became a real product example of natural-language input flowing into a structured draft that a human refines further.',
      },
      tech: ['Astro', 'React', 'Leaflet', 'TypeScript', 'Markdown', 'GitHub Pages', 'Antigravity'],
      referenceImages: [
        {
          src: '/images/portfolio/commit-map-overview.png',
          href: 'https://map.dongholab.com/',
          title: {
            ko: '메인 화면: 세계 지도와 여행 계획 카드',
            en: 'Home screen: world map and trip cards',
          },
          caption: {
            ko: '국가 필터, 세계 지도, 여행 계획 카드가 한 화면에서 이어지는 구성을 참고 이미지로 정리했습니다.',
            en: 'A reference view showing the country filters, world map, and trip-planning cards in one continuous screen.',
          },
          alt: {
            ko: 'Commit Map 메인 화면 참고 이미지',
            en: 'Reference image of the Commit Map home screen',
          },
        },
      ],
    },
    {
      slug: 'membership-migration',
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
        ko: '레거시 API 응답 동등성 검증 기반 Spring Boot 무중단 이관',
        en: 'Migrated the legacy service to Spring Boot through API-response parity verification',
      },
      summary: {
        ko:
          '리텐션 강화를 위해 멤버십 등급 체계를 재설계하고, 레거시 멤버십 서비스(cormo.js 기반)를 Spring Boot로 1:1 DB 마이그레이션 및 무중단 이관했습니다. 특히 기존 멤버십 API에서 실제 request·response 셋을 수집해 테스트케이스를 만들고, 이를 Spring 로직에 직접 재주입해 응답 차이를 비교한 뒤 게이트웨이를 점진 전환하는 방식으로 오픈했으며, 월간 등급 산정도 Athena partition source 기반으로 다시 정리했습니다.',
        en:
          'Redesigned membership tiers for retention, migrated the legacy membership service (cormo.js-based) to Spring Boot through a 1:1 DB migration with zero downtime, and did the cutover by collecting real request/response sets from the legacy membership API, turning them into test cases, replaying them through the Spring implementation, and comparing output before gradually switching the gateway. The monthly tier calculation was also rebuilt around a partitioned Athena source.',
      },
      challenge: {
        ko:
          '기존 cormo.js 기반 서비스를 1:1 DB 마이그레이션으로 옮기면서도 실제 사용자 응답이 달라지지 않게 유지해야 했고, 월간 등급 산정 배치가 사용자 수와 월 수가 늘어날수록 더 넓은 범위를 재조회하는 구조가 되지 않도록 막아야 했습니다.',
        en:
          'The project required a 1:1 DB migration from the cormo.js legacy service while keeping real user-facing responses unchanged, while also preventing monthly tier batches from widening their scan scope as both users and months accumulated.',
      },
      actions: [
        {
          ko: '기존 멤버십 API에서 실제 request·response 셋을 수집하고, query·body·경계 케이스까지 테스트케이스로 정리한 뒤 Spring Boot 구현에 같은 입력을 직접 넣어 응답 차이를 비교했습니다.',
          en: 'Collected real request/response sets from the legacy membership API, organized them into test cases across query, body, and edge conditions, and replayed the same inputs through the Spring Boot implementation to compare output diffs.',
        },
        {
          ko: '멤버십 등급 산정 기간을 3개월에서 6개월로 확대했습니다.',
          en: 'Expanded the membership tier calculation period from 3 to 6 months.',
        },
        {
          ko: '응답 동등성 검증을 통과한 뒤 게이트웨이를 점진적으로 전환해, 사용자 응답을 깨지 않고 Spring Boot 서비스로 무중단 오픈했습니다.',
          en: 'After passing response-parity verification, gradually switched the gateway so the Spring Boot service could be opened without breaking user responses.',
        },
        {
          ko: 'Athena `vip_confirmed_paid_partitioned`를 `stamp_date` 기준으로 조회하고, `queryExecutionId + nextToken`으로 페이지 처리한 뒤 `UserConfirmedPaid(cashAmountConfirmed, cashAmountPredicted)`로 변환해 월간 배치 입력으로 사용했습니다.',
          en: 'Queried Athena `vip_confirmed_paid_partitioned` by `stamp_date`, paged results with `queryExecutionId + nextToken`, and converted them into `UserConfirmedPaid(cashAmountConfirmed, cashAmountPredicted)` as the monthly batch input.',
        },
        {
          ko: '`cashAmountConfirmed`를 최근 6개월 누적 확정금액으로 사용해 등급을 계산하고, 결과는 `saveMembershipBatchInsert` / `updateMembershipBatchUpdate`로 batch upsert했으며, 조회는 `getConfirmedAmountUpdateDateMonthYmSet(3/2)`와 `membership_logs`의 `date_applied_ym` RANGE PARTITION으로 최근 월 범위만 다루도록 정리했습니다.',
          en: 'Used `cashAmountConfirmed` as the six-month confirmed cumulative amount for level calculation, batch-upserted the result through `saveMembershipBatchInsert` / `updateMembershipBatchUpdate`, and bounded reads to recent months with `getConfirmedAmountUpdateDateMonthYmSet(3/2)` plus `date_applied_ym` range partitioning on `membership_logs`.',
        },
      ],
      engineeringViews: [
        {
          ko: '무중단 이관은 기능 추가보다 응답 동등성 확보를 먼저 두고, 실제 레거시 API request·response 셋을 테스트 자산으로 바꿔 Spring 구현에 반복 재주입하는 방식으로 검증했습니다.',
          en: 'Treated zero-downtime migration as a response-parity problem first, turning real legacy API request/response sets into reusable test assets that were repeatedly replayed against the Spring implementation.',
        },
        {
          ko: '월간 배치는 Athena partitioned source에서 필요한 `stamp_date`만 읽고, `queryExecutionId + nextToken`으로 잘게 나눠 가져오도록 구성해 대량 대상도 한 번에 메모리로 끌어오지 않게 했습니다.',
          en: 'Built the monthly batch to read only the required `stamp_date` from a partitioned Athena source and page through results with `queryExecutionId + nextToken`, avoiding a full in-memory load for large target sets.',
        },
        {
          ko: '`UserConfirmedPaid`에 최근 6개월 확정금액과 이번 달 포함 누적값을 분리해 담고, 이를 `confirmedAmount`, `confirmedAmountNow`, `confirmed5MonthAmount`로 저장해 등급 산정과 이후 조회 기준이 데이터 모델에 직접 남도록 했습니다.',
          en: 'Stored both six-month confirmed totals and current-month-inclusive totals in `UserConfirmedPaid`, then persisted them as `confirmedAmount`, `confirmedAmountNow`, and `confirmed5MonthAmount` so tier logic and later reads could rely on the model directly.',
        },
        {
          ko: '배치 쓰기는 JDBC batch insert/update로 묶고, 조회 쪽은 `getConfirmedAmountUpdateDateMonthYmSet`으로 최근 월 집합만 보게 하며 `membership_logs`는 `date_applied_ym` RANGE PARTITION으로 관리해 데이터가 쌓여도 필요한 월만 다루게 했습니다.',
          en: 'Grouped writes into JDBC batch insert/update, limited reads to recent month sets with `getConfirmedAmountUpdateDateMonthYmSet`, and managed `membership_logs` with `date_applied_ym` range partitions so only the needed months are touched as data grows.',
        },
      ],
      outcomes: [
        {
          ko: '월간 누적합과 월간 파티셔닝 구조로 DB 부하를 임계치 70%에서 30% 이내로 낮췄습니다.',
          en: 'Reduced DB load from a 70% threshold to under 30% through monthly cumulative sums and monthly partitioning.',
        },
        {
          ko: '기존 API request·response 셋 기반 테스트케이스와 Spring 응답 비교를 통과한 뒤 게이트웨이를 점진 전환해 무중단 배포를 성공시켰습니다.',
          en: 'Achieved zero-downtime deployment by passing request/response-set-based parity tests between the legacy API and the Spring implementation, then gradually switching the gateway.',
        },
        {
          ko: 'Athena partitioned source, page reader, JDBC batch upsert, 최근 월 집합 조회를 조합해 대량 고객 데이터가 누적돼도 월별 등급 산정 성능을 안정적으로 유지했습니다.',
          en: 'Combined a partitioned Athena source, paged reader, JDBC batch upsert, and recent-month-scoped lookups to keep monthly tier-calculation performance stable as customer data accumulated.',
        },
      ],
        note: {
          ko: '실제 레거시 API 응답 셋을 수집해 Spring 구현과 동등성 비교를 거친 뒤 점진 오픈한 무중단 이관과, Athena 기반 멤버십 배치 최적화를 함께 설명하기 좋은 프로젝트입니다.',
          en: 'A strong project for explaining zero-downtime migration through legacy-response parity checks together with Athena-based membership-batch optimization.',
        },
        tech: ['Kotlin', 'Spring Boot', 'Spring Batch', 'DGS Framework(GraphQL)', 'JPA', 'MySQL', 'Kafka', 'AWS Athena'],
        referenceLayout: 'split-with-context',
        referenceImages: [
          {
            src: '/images/portfolio/zigzag-membership.jpg',
            title: {
              ko: '지그재그 멤버십: 등급 혜택 노출 화면',
              en: 'Zigzag membership: tier-benefit screen',
            },
            caption: {
              ko: '확장된 멤버십 등급 체계와 등급별 혜택이 실제 사용자 화면에서 어떻게 노출되는지 보여주는 예시입니다.',
              en: 'A reference view showing how the expanded membership-tier system and tier benefits were exposed in the actual user-facing UI.',
            },
            alt: {
              ko: '지그재그 멤버십 혜택 화면',
              en: 'Zigzag membership benefit screen',
            },
          },
        ],
        diagrams: [
          {
            title: {
              ko: '기존 API 응답 동등성 검증 기반 무중단 이관',
            en: 'Zero-downtime migration through legacy API response-parity checks',
          },
          description: {
            ko:
              '기존 멤버십 API에서 request·response 셋을 수집해 테스트케이스로 만들고, Spring Boot 구현에 같은 입력을 재주입해 응답 차이를 비교한 뒤 게이트웨이를 점진 전환하는 무중단 이관 흐름을 보여줍니다.',
            en:
              'Shows the zero-downtime migration flow that collects request/response sets from the legacy membership API, replays the same inputs through the Spring Boot implementation, compares output diffs, and then gradually switches the gateway.',
          },
          code: membershipParityMigrationDiagram,
        },
        {
          title: {
              ko: '월간 누적합과 월간 파티셔닝 기반 멤버십 배치',
            en: 'Membership batch with monthly cumulative sums and monthly partitioning',
          },
          description: {
            ko:
              'Athena의 `vip_confirmed_paid_partitioned`를 `stamp_date` 기준으로 읽고, `UserConfirmedPaid`를 거쳐 멤버십을 batch upsert한 뒤, 최근 월 집합 조회와 `membership_logs` 파티셔닝으로 범위를 제한하는 흐름을 보여줍니다.',
            en:
              'Shows the flow from Athena `vip_confirmed_paid_partitioned` by `stamp_date`, through `UserConfirmedPaid` and membership batch upserts, into recent-month-scoped lookups and `membership_logs` partitioning.',
          },
          code: membershipBatchPartitionDiagram,
        },
      ],
    },
  ],
};

export function portfolioText(value: Localized, lang: Lang) {
  return lang === 'en' ? value.en : value.ko;
}
