export type Lang = 'ko' | 'en';

export interface Localized {
  ko: string;
  en: string;
}

export interface Contact {
  phone: string;
  email: string;
  github_url: string;
  github_label: string;
  linkedin_url: string;
  linkedin_label: string;
}

export interface Experience {
  company: Localized;
  period: Localized;
  role?: Localized;
  /** EN-only location line (e.g. city) */
  location_en?: string;
  description: Localized;
}

export interface SkillGroup {
  label: string;
  body_ko: string;
  body_en: string;
}

export interface EducationItem {
  school: Localized;
  degree: Localized;
  period: Localized;
}

export interface Award {
  title: string;
  subtitle?: Localized;
}

export interface Activity {
  title: Localized;
  period: Localized;
}

export interface Project {
  title: Localized;
  period: Localized;
  badge?: Localized;
  summary?: Localized;
  tech: string[];
  highlights: { ko: string[]; en: string[] };
  results?: { ko: string[]; en: string[] };
}

export interface ProjectSection {
  heading: Localized;
  projects: Project[];
}

export interface ResumeProfile {
  name: string;
  name_en: string;
  contact: Contact;
  summary: Localized;
  experience: Experience[];
  skillGroups: SkillGroup[];
  education: EducationItem[];
  awards: Award[];
  activities: Activity[];
  /** Sidebar note on EN resume (language proficiency) */
  languages_note?: Localized;
  projectSections: ProjectSection[];
}
