export function isLinkActive(currentUrl: string, linkUrl: string): boolean {
  return currentUrl === '/' ? currentUrl === linkUrl : currentUrl.includes(linkUrl) && linkUrl !== '/';
}
