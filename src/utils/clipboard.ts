/**
 * Copy text to clipboard — iOS Safari & PWA-compatible.
 *
 * Uses a visible-but-tiny <span> with `user-select: all` and a Range selection,
 * which is the battle-tested pattern used by libraries like `copy-to-clipboard`.
 *
 * Must be called SYNCHRONOUSLY inside a click handler — no `await` before this.
 */
export function copyToClipboard(text: string): boolean {
  let success = false;

  // Save current selection to restore later
  const previousSelection =
    document.getSelection()?.rangeCount && document.getSelection()?.rangeCount! > 0
      ? document.getSelection()?.getRangeAt(0)
      : null;

  // Create a span with the text — must be non-zero size and visible to iOS
  const span = document.createElement('span');
  span.textContent = text;
  span.style.whiteSpace = 'pre';
  span.style.userSelect = 'all';
  (span.style as CSSStyleDeclaration & { webkitUserSelect?: string }).webkitUserSelect = 'all';
  span.style.position = 'fixed';
  span.style.top = '0';
  span.style.left = '0';
  span.style.padding = '0';
  span.style.margin = '0';
  span.style.fontSize = '12pt';
  span.style.color = 'transparent';
  span.style.background = 'transparent';
  span.style.pointerEvents = 'none';
  // 1x1 but visible — iOS doesn't allow selection on opacity:0
  span.style.width = '1px';
  span.style.height = '1px';
  span.style.overflow = 'hidden';

  document.body.appendChild(span);

  try {
    const range = document.createRange();
    range.selectNodeContents(span);

    const selection = window.getSelection();
    if (selection) {
      selection.removeAllRanges();
      selection.addRange(range);
    }

    success = document.execCommand('copy');
  } catch {
    success = false;
  }

  // Cleanup
  document.body.removeChild(span);

  // Restore previous selection
  if (previousSelection) {
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(previousSelection);
  }

  // Fire-and-forget the modern API as a backup (does nothing if execCommand worked)
  if (!success && navigator.clipboard && window.isSecureContext) {
    try {
      navigator.clipboard.writeText(text).then(
        () => {},
        () => {}
      );
      success = true;
    } catch {
      // ignore
    }
  }

  return success;
}
