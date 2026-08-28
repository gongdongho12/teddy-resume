# Resume update workflow

When collecting work history or updating the resume, use the `resume-worklog` skill and `notes/resume-activity/` as the durable source.

Before editing `profile.yaml` or `portfolio-content.ts`, show the proposed changes and wait for explicit approval. After an approved update, keep both files consistent and mark the source activity entries as reflected.

Before committing changes to resume content, templates, pagination, print CSS, fonts, or PDF export, use the `resume-a4-check` skill. `npm run verify:a4` must pass for Korean and English in both default and creative templates, and every rendered page must be visually inspected. Do not commit a failing or unreviewed A4 result.

For English resume copy, treat Korean as the factual source rather than a sentence template. Write natural international resume English, explain Korea-specific products on first mention, replace internal shorthand with broadly understood terminology, and keep claims, dates, metrics, and responsibility aligned across languages. Ask only when the Korean source leaves material scope ambiguous.
