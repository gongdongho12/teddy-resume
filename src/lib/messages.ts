import type { Lang } from '@/lib/resume-types';

const table: Record<
  Lang,
  {
    docTitle: string;
    printFileTitle: string;
    experience: string;
    skills: string;
    education: string;
    awards: string;
    activities: string;
    languages: string;
    results: string;
    printHint: string;
    contactVisibility: string;
  }
> = {
  ko: {
    docTitle: '강동호 — 이력서',
    printFileTitle: '강동호 Software Engineer 이력서',
    experience: '경력',
    skills: '기술',
    education: '학력',
    awards: '수상',
    activities: '기타 활동 내역',
    languages: '언어',
    results: '성과',
    printHint: '인쇄 시 배경 그래픽 포함 + 여백 없음 설정으로 깔끔하게 출력 가능',
    contactVisibility: '연락처 표기',
  },
  en: {
    docTitle: 'Dongho Kang — Resume',
    printFileTitle: 'Dongho Kang Software Engineer Resume',
    experience: 'Experience',
    skills: 'Skills',
    education: 'Education',
    awards: 'Awards',
    activities: 'Other Activities',
    languages: 'Language',
    results: 'Outcomes',
    printHint: 'Print tip: Background Graphics + Margins None',
    contactVisibility: 'Contact Info',
  },
};

export function messages(lang: Lang) {
  return table[lang];
}
