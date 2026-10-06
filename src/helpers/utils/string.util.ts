/**
 * Convert a string to slug format (e.g. "Hello World" -> "hello-world")
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')        // spaces -> dash
    .replace(/[^\w\-]+/g, '')    // remove non-word chars
    .replace(/\-\-+/g, '-')      // collapse multiple dashes
    .replace(/^-+/, '')          // trim leading dash
    .replace(/-+$/, '');         // trim trailing dash
}

/**
 * Truncate a string to a given length and append ellipsis
 */
export function truncate(text: string, maxLength: number, ellipsis = '...'): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - ellipsis.length) + ellipsis;
}

/**
 * Capitalize the first letter of a string
 */
export function capitalize(text: string): string {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/**
 * Mask sensitive data (e.g. email: "jo**@gmail.com")
 */
export function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!local || !domain) return email;
  const masked = local.slice(0, 2) + '*'.repeat(Math.max(0, local.length - 2));
  return `${masked}@${domain}`;
}

/**
 * Remove all whitespace from a string
 */
export function removeWhitespace(text: string): string {
  return text.replace(/\s+/g, '');
}
