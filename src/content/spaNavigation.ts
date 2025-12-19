/**
 * Subscribe to URL changes on SPA sites by hooking history methods + popstate.
 *
 * @param onChange - Called when location.href changes.
 * @returns Cleanup function.
 */
export function subscribeToUrlChanges(onChange: (href: string) => void): () => void {
  let lastHref = window.location.href;

  /**
   * @returns void
   */
  const notifyIfChanged = (): void => {
    const current = window.location.href;
    if (current === lastHref) {
      return;
    }
    lastHref = current;
    onChange(current);
  };

  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;

  history.pushState = function pushStatePatched(...args: Parameters<History["pushState"]>): void {
    originalPushState.apply(this, args);
    notifyIfChanged();
  };

  history.replaceState = function replaceStatePatched(
    ...args: Parameters<History["replaceState"]>
  ): void {
    originalReplaceState.apply(this, args);
    notifyIfChanged();
  };

  window.addEventListener("popstate", notifyIfChanged);

  const interval = window.setInterval(notifyIfChanged, 1500);

  /**
   * @returns void
   */
  const cleanup = (): void => {
    history.pushState = originalPushState;
    history.replaceState = originalReplaceState;
    window.removeEventListener("popstate", notifyIfChanged);
    window.clearInterval(interval);
  };

  return cleanup;
}
