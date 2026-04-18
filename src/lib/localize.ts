import { DEFAULT_LANG } from '@/lib/i18n';
import type { Lang, Localized } from '@/lib/resume-types';

export function t(loc: Localized, lang: Lang): string {
  const value = loc[lang]?.trim();
  if (value) return value;
  return loc[DEFAULT_LANG];
}

export function bullets(
  items: Record<Lang, string[]>,
  lang: Lang,
): string[] {
  if (items[lang]?.length > 0) return items[lang];
  return items[DEFAULT_LANG] ?? [];
}
