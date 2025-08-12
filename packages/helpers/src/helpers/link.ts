export function isLinkActive(currentUrl: string, linkUrl: string): boolean {
  if (currentUrl === '/') return currentUrl === linkUrl;

  return currentUrl.includes(linkUrl) && linkUrl !== '/';
}
