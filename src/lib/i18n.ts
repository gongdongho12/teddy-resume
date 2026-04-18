import { baseUrlJoin } from '@/lib/base-url';
import type { TemplateId } from '@/lib/templates';

export const SUPPORTED_LANGS = ['ko', 'en'] as const;
export type Lang = (typeof SUPPORTED_LANGS)[number];

export const DEFAULT_LANG: Lang = 'ko';

export const LANGUAGE_LABELS: Record<Lang, string> = {
  ko: '한국어',
  en: 'English',
};

export const LANGUAGE_SHORT_LABELS: Record<Lang, string> = {
  ko: 'KO',
  en: 'EN',
};

export function isSupportedLang(value: string): value is Lang {
  return SUPPORTED_LANGS.includes(value as Lang);
}

export function normalizeLang(value: string | undefined): Lang {
  if (value && isSupportedLang(value)) return value;
  return DEFAULT_LANG;
}

export function getTemplateUrl(lang: Lang, template: TemplateId): string {
  return baseUrlJoin(lang, template);
}

export function getPortfolioUrl(lang: Lang): string {
  return baseUrlJoin('portfolio', lang);
}
