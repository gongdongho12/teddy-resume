---
name: resume-a4-check
description: Verify Teddy Resume print output as exact A4 PDFs and block commits when Korean or English pages clip, overflow, split unexpectedly, or render poorly. Use after resume content/layout changes and before committing resume-related work.
---

# Resume A4 Check

Treat A4 verification as a required quality gate for resume content, layout, pagination, fonts, and print CSS changes.

## Layout approval boundary

Preserve the established visual structure unless the user explicitly approves a proposed change. Before changing column counts, hiding content in print, reordering sections, forcing new page boundaries, regrouping cards, or shrinking typography and spacing to reduce page count, show what will change and wait for approval. A request for one layout change does not authorize adjacent restructuring.

Keep Other Activities in its existing two-column desktop and print layout unless the user explicitly approves another structure. When pagination leaves blank space, prefer reporting the tradeoff over hiding content or changing columns without approval.

## Run the gate

Run `npm run verify:a4` from the repository root. It builds the site, renders Korean and English PDFs for the default and creative templates, checks 210mm × 297mm sizing, compares DOM and PDF page counts, and fails on overflow, clipped elements, oversized pagination items, browser errors, or non-A4 page geometry.

The gate must also reject non-string resume bullet items and rendered placeholder tokens such as `[object Object]`, `[object Promise]`, or `undefined`.

Read `tmp/pdfs/a4-check/report.json`. Inspect every rendered PNG in the same directory for visual defects that structural checks cannot catch, including awkward page breaks, orphan headings, overlapping text, tiny type, missing glyphs, and excessive blank space.

If the command or visual review fails, do not commit. Fix the content or layout and rerun the complete gate.

## Debug pagination

Use `npm run verify:a4:debug` or append `?a4-debug=1` to a resume URL. Debug mode overlays a 5mm grid, stronger 10mm grid lines, and a dashed 12mm safe area. The grid is QA-only and must not appear in normal exports.

## Commit rule

Before committing changes to resume content, templates, pagination, print styling, PDF export, or fonts:

1. Require a passing `npm run verify:a4` result for all four variants.
2. Require visual inspection of all rendered PDF pages.
3. Report the checked variants and page counts in the handoff or commit summary.

Do not weaken or bypass a failing check merely to complete a commit.
