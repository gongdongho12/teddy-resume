import type { Lang } from './resume-types';

const table: Record<
  Lang,
  {
    docTitle: string;
    navOther: string;
    experience: string;
    skills: string;
    education: string;
    awards: string;
    activities: string;
    languages: string;
    results: string;
    printHint: string;
  }
> = {
  ko: {
    docTitle: '강동호 — 이력서',
    navOther: 'English',
    experience: '경력',
    skills: '기술',
    education: '학력',
    awards: '수상',
    activities: '활동 및 강연',
    languages: '언어',
    results: '성과',
    printHint: '인쇄 시 배경 그래픽 포함',
  },
  en: {
    docTitle: 'Dongho Kang — Resume',
    navOther: '한국어',
    experience: 'Experience',
    skills: 'Skills',
    education: 'Education',
    awards: 'Awards',
    activities: 'Community & Speaking',
    languages: 'Language',
    results: 'Outcomes',
    printHint: 'Use browser Print → Save as PDF for export',
  },
};

export function messages(lang: Lang) {
  return table[lang];
}
