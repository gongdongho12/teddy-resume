---
name: resume-worklog
description: Maintain the local resume-activity inbox and update Teddy Resume from approved, evidence-backed work candidates. Use when collecting career-worthy work or refreshing the resume/portfolio from prior activity records.
---

# Resume Worklog

Use `notes/resume-activity/` as the durable source between work summaries and resume updates.

## Collecting activity

Read `notes/resume-activity/README.md` and upsert only work that meets its significance rules. Prefer PR URLs and commit hashes as evidence. Never record customer identifiers, production record IDs, raw logs, secrets, or unsupported metrics.

Deduplicate by evidence. New completed work uses `status: candidate`; large unfinished work may be recorded with `delivery: in_progress` but is not resume-ready.

## Updating the resume

1. Read all monthly YAML files and select `status: candidate` entries whose delivery is complete.
2. Show the proposed target section and concise Korean/English wording before editing. Do not modify resume content until the user approves the proposal.
3. After approval, update `src/content/resume/profile.yaml` and keep the linked entry in `src/lib/portfolio-content.ts` consistent.
4. Validate YAML and run the `resume-a4-check` skill. Do not commit or mark work reflected until all four PDF variants pass structural and visual review.
5. Set the applied entries to `status: reflected` with `reflected_at`. Use `skip` and `skip_reason` when the user rejects an item.

Do not rescan full Claude histories or every workspace repository unless the user requests a backfill or the activity inbox has a known gap.

## English writing standard

Use Korean as the factual source, not as an English sentence template. Extract the role, action, scope, and outcome first, then write concise professional English that preserves exactly those claims.

- Replace Korean workplace shorthand with internationally legible terms: `MSA` with `microservices`, `PG` with `payment gateway`, `Admin` with `operations console`, and `유저사이드` with `customer-facing` when that is the intended meaning.
- Explain Korea-specific products on first mention. Example: `Kakao T, a South Korean ride-hailing and mobility platform`.
- Prefer specific action and outcome language over literal abstractions such as `service completeness`, `work language`, `foundation`, or `enhancement`.
- Do not strengthen ownership, scale, or outcomes beyond the Korean evidence. Remove unsupported business claims instead of making them sound more impressive in English.
- Keep Korean and English entries aligned in project selection, dates, metrics, and responsibility. Ask the user only when the Korean source itself leaves the intended scope ambiguous.
- Review rendered English for awkward line length and unexplained acronyms after the wording pass.
