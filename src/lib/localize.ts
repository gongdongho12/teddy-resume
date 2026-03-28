import type { Lang, Localized } from './resume-types';

export function t(loc: Localized, lang: Lang): string {
  if (lang === 'en') {
    const v = loc.en?.trim();
    if (v) return loc.en;
  }
  return loc.ko;
}

export function bullets(
  items: { ko: string[]; en: string[] },
  lang: Lang,
): string[] {
  if (lang === 'en' && items.en.length > 0) return items.en;
  return items.ko;
}
