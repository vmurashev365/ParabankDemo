const FRAGILE_PATTERNS = [/nth-(child|of-type)/i, /::?slotted/i, /\/[\w\-/]+\/\w+/];
const RANDOM_CLASS_PATTERN = /\.[a-z0-9]{6,}-[a-z0-9]{6,}/i;

export function suggestTestId(pageName: string, componentName: string, elementName: string): string {
  const parts = [pageName, componentName, elementName]
    .filter(Boolean)
    .map((part) => part.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-'));
  return parts.join('-');
}

export function isLocatorFragile(selector: string): boolean {
  if (!selector) {
    return true;
  }

  if (RANDOM_CLASS_PATTERN.test(selector)) {
    return true;
  }

  return FRAGILE_PATTERNS.some((pattern) => pattern.test(selector));
}
