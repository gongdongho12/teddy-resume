---
name: Application Drafter
description: Workflow and instructions for analyzing a job application YAML and drafting tailored essay responses based on the user's resume facts.
---
# Application Drafter Skill

When the user asks you to "draft my application for [Company]" or invokes this skill, follow this procedure:

## 1. Locate and Read Inputs
- Read the single source of truth for facts: `src/content/resume/profile.yaml`.
- Search the `src/content/applications/` directory for the relevant company yaml file.
- Read the target application file. Get the `job_description` and the `responses` array.

## 2. Analyze Alignment
- Extrapolate the requirements from the `job_description` (e.g., hard skills, soft skills, specific experiences).
- Cross-reference the skills, roles, and projects mentioned in `profile.yaml` with the extracted requirements.
- Mentally note the top 2-3 most relevant experiences from the resume to focus on.

## 3. Draft Responses
- Iterate through each item into the `responses` array in the application YAML.
- Check the `question` and any `guidance` or `max_length`.
- Write a professional, impact-driven response focusing on the **STAR** (Situation, Task, Action, Result) method.
- **Crucial Rule**: NEVER invent facts, metrics, or technologies that are not explicitly stated in `profile.yaml`.

## 4. Apply Changes
- Use the `replace_file_content` or `multi_replace_file_content` tool to write the drafted content into the `draft_ko` (for Korean) or `draft_en` (for English) fields within the application YAML file. 
- DO NOT alter the `profile.yaml` file yourself.

## 5. Summary
- Present the drafted answers to the user and ask if they would like any revisions in tone, length, or focus.
