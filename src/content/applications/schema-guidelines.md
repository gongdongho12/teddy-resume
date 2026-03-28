# Application & Cover Letter Schema Guidelines

To ensure your resume remains the single source of truth for facts while still allowing you to draft tailored applications (e.g., cover letters, essay questions), we use the `applications` directory.

## Core Principles

1. **Do not pollute `profile.yaml` with company-specific details.**
2. **Use AI to draft answers based *only* on the facts in `profile.yaml`.**
3. **Store both the prompts (Job Description, Questions) and the drafted responses here.**

## Directory Structure

Place your application files in `src/content/applications/`. They should be named simply mapping the company and position:

```text
src/content/applications/
  ├── companya-frontend-2026.yaml
  ├── companyb-fullstack.yaml
  └── ...
```

## Recommended YAML Schema

Below is the standard schema you should use when creating a new application file:

```yaml
company: "Company Name"
role: "Target Position"
status: "draft" # or "submitted", "final"
deadline: "2026-12-31"

# Paste the job description or relevant requirements here.
# AI agents will use this to align your resume facts with the role.
job_description: |
  - Requires 3+ years of experience in React and TypeScript.
  - Strong capability in web performance optimization.
  - Collaborative mindset.

responses:
  - id: "q1"
    question: "Why do you want to join us and what can you contribute?"
    max_length: 1000
    
    # Optional: Context you want to provide to the AI for this specific question
    guidance: "Focus on my Webpack optimization project and how it reduced load time."
    
    # The AI will generate these drafts (or you can write them)
    draft_ko: |
      (초안이 여기에 작성됩니다)
    draft_en: |
      (English draft will be populated here)
      
    # Once finalized, you move the content here and mark status as 'final'
    final: |
      
```

## How to use with AI (Cursor / Antigravity)

When you want to draft answers for a specific application:

1. Create the `.yaml` file using the schema above.
2. Fill out the `job_description` and the `question` fields.
3. Open a prompt in Cursor or Antigravity and say:
   **"Draft the answers for `companya-frontend-2026.yaml` using the facts from `profile.yaml`."**
4. The AI will read your resume, read the job requirements, and fill in `draft_ko` and `draft_en` for you.
