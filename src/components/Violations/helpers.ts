export function addIdForPermalink(id: string) {
  const tokenPattern = /[\d|a-f]{8}-([\d|a-f]{4}-){3}[\d|a-f]{12}/g;
  const paths = location.pathname.split('/');
  const hasId = paths.filter(path => tokenPattern.test(path as string))[0];
  const hasExactId = location.href.includes(id);

  if (hasId && hasExactId) {
    navigator.clipboard.writeText(location.href);
    return;
  }

  if (hasId) {
    const newHref = location.href.replace(tokenPattern, '');
    navigator.clipboard.writeText(`${newHref}${id}`);
    history.pushState('', '', `${newHref}${id}`);
    return;
  }

  navigator.clipboard.writeText(`${location.href}/${id}`);
  history.pushState('', '', `${location.href}/${id}`);
}
