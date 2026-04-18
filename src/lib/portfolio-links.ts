import { getPortfolioUrl } from '@/lib/i18n';
import type { Lang } from '@/lib/resume-types';

export function getPortfolioProjectHref(
  lang: Lang,
  portfolioSlug?: string,
  portfolioAnchor?: string,
): string | undefined {
  const baseUrl = getPortfolioUrl(lang);
  if (portfolioAnchor) {
    return `${baseUrl}#${portfolioAnchor}`;
  }

  if (portfolioSlug) {
    return `${baseUrl}#${portfolioSlug}`;
  }

  return undefined;
}
