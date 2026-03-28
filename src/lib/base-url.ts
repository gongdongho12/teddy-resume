/**
 * `astro.config`의 `base`가 `/teddy-resume` 또는 `/teddy-resume/` 둘 다 올 수 있어
 * 경로를 안전하게 이어붙입니다. (미들 슬래시 누락으로 `.../teddy-resumeresume` 방지)
 */
export function baseUrlJoin(...segments: string[]): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const rest = segments
    .filter(Boolean)
    .map((s) => s.replace(/^\/+|\/+$/g, ''))
    .filter(Boolean)
    .join('/');
  const path = rest ? `${base}/${rest}` : base;
  return path.endsWith('/') ? path : `${path}/`;
}
