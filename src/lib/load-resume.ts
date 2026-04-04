import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';
import type { ResumeProfile } from '@/lib/resume-types';

/** Astro 빌드 번들 후에도 프로젝트 루트 기준으로 읽기 */
export function loadResume(): ResumeProfile {
  const profilePath = path.join(process.cwd(), 'src/content/resume/profile.yaml');
  const raw = fs.readFileSync(profilePath, 'utf-8');
  return YAML.parse(raw) as ResumeProfile;
}
