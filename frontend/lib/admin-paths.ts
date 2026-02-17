/**
 * Paths do painel admin - no subdomínio painel.* usa paths curtos (/login, /dashboard)
 * no domínio principal usa paths com /admin (/admin/login, /admin/dashboard)
 */
export function getAdminPath(path: string): string {
  if (typeof window === "undefined") return `/admin${path}`;
  return /^painel\./.test(window.location.hostname) ? path : `/admin${path}`;
}

export function getAdminLoginPath(): string {
  return getAdminPath("/login");
}
