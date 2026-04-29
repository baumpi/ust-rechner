/**
 * Copy text to clipboard — synchronous-first to preserve iOS Safari user-gesture chain.
 *
 * iOS quirk: `await navigator.clipboard.writeText()` breaks the user-gesture context
 * if used as the FIRST async operation in a click handler. So we attempt the
 * synchronous `execCommand('copy')` path first, which doesn't break the gesture.
 *
 * Returns true if copy was likely successful.
 */
export function copyToClipboard(text: string): boolean {
  // === Method 1: Synchronous textarea + execCommand (works on iOS) ===
  let success = false;

  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.contentEditable = 'true';
    textarea.style.position = 'fixed';
    textarea.style.top = '0';
    textarea.style.left = '0';
    textarea.style.width = '2em';
    textarea.style.height = '2em';
    textarea.style.padding = '0';
    textarea.style.border = 'none';
    textarea.style.outline = 'none';
    textarea.style.boxShadow = 'none';
    textarea.style.background = 'transparent';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);

    // iOS-specific: must use Range + selection
    if (/iP(hone|ad|od)/.test(navigator.userAgent) || /Mac/.test(navigator.userAgent)) {
      const range = document.createRange();
      range.selectNodeContents(textarea);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
      textarea.setSelectionRange(0, text.length);
    } else {
      textarea.focus();
      textarea.select();
    }

    success = document.execCommand('copy');
    document.body.removeChild(textarea);
  } catch {
    success = false;
  }

  // === Method 2: Modern Clipboard API (fire-and-forget, async) ===
  // Run as a backup — if execCommand worked, this is just redundant.
  // Don't await — we can't (function is sync); fire-and-forget is fine.
  if (navigator.clipboard && window.isSecureContext) {
    try {
      navigator.clipboard.writeText(text).catch(() => {});
      success = true;
    } catch {
      // ignore
    }
  }

  return success;
}
