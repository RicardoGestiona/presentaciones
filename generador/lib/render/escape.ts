// HTML escape for safe string output in HTML context
export function escape(str: string | undefined): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Safely create HTML attribute strings
export function attr(name: string, value: string | boolean | undefined): string {
  if (value === undefined || value === false) return '';
  if (value === true) return ` ${name}`;
  return ` ${name}="${escape(String(value))}"`;
}
