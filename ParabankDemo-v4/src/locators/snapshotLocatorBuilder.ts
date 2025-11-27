export type ParsedSnapshot = {
  raw: string;
  // TODO: replace with a real DOM Document once HTML parsing library is available
};

export type LocatorCandidate = {
  name: string;
  selector: string;
  role?: string;
  label?: string;
};

export function parseHtmlSnapshot(html: string): ParsedSnapshot {
  // TODO: use DOMParser/JSDOM to return a Document instead of raw string storage
  return { raw: html };
}

export function extractInputsAndButtons(html: string): LocatorCandidate[] {
  const candidates: LocatorCandidate[] = [];
  const inputRegex = /<(input)([^>]*)>/gi;
  const buttonRegex = /<(button)([^>]*)>([^<]*)<\/button>/gi;

  let match: RegExpExecArray | null;
  while ((match = inputRegex.exec(html))) {
    const attrs = match[2];
    const name = getAttribute(attrs, 'name') || getAttribute(attrs, 'id') || getAttribute(attrs, 'aria-label') || 'input';
    const label = getAttribute(attrs, 'aria-label') || getAttribute(attrs, 'placeholder') || name;
    const role = deriveRole(match[1], attrs);
    const selector = buildSelector({ role, label, name });
    candidates.push({ name, selector, role, label });
  }

  while ((match = buttonRegex.exec(html))) {
    const attrs = match[2];
    const textContent = match[3].trim() || getAttribute(attrs, 'aria-label') || 'button';
    const label = getAttribute(attrs, 'aria-label') || textContent;
    const role = 'button';
    const selector = buildSelector({ role, label, name: textContent });
    candidates.push({ name: textContent, selector, role, label });
  }

  return candidates;
}

function getAttribute(attrs: string, attribute: string): string | undefined {
  const regex = new RegExp(`${attribute}=['\"]([^'\"]+)['\"]`, 'i');
  const result = regex.exec(attrs);
  return result?.[1];
}

function deriveRole(tagName: string, attrs: string): string {
  const explicitRole = getAttribute(attrs, 'role');
  if (explicitRole) {
    return explicitRole;
  }
  if (tagName.toLowerCase() === 'button') {
    return 'button';
  }
  const type = getAttribute(attrs, 'type');
  if (type === 'submit') {
    return 'button';
  }
  return 'textbox';
}

function buildSelector({ role, label, name }: { role?: string; label?: string; name: string }): string {
  if (role && label) {
    return `getByRole('${role}', { name: /${escapeRegex(label)}/i })`;
  }
  if (label) {
    return `getByLabel('${label}')`;
  }
  return `getByText('${name}')`;
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
