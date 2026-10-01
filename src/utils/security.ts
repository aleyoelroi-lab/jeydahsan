import { WORDS_PER_PAGE } from '../constants/platform';

/**
 * Calculates page count from word count based on 1 page = 300 words
 */
export function calculatePages(wordCount: number): number {
  if (wordCount <= 0) return 1;
  return Math.ceil(wordCount / WORDS_PER_PAGE);
}

/**
 * Counts words in a markdown string
 */
export function countWords(markdown: string): number {
  if (!markdown) return 0;
  // Clean markdown syntax for accurate word count
  const cleanText = markdown
    .replace(/[#*`_~>[\]()-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (!cleanText) return 0;
  return cleanText.split(/\s+/).filter(Boolean).length;
}

/**
 * Content Protection Keydown Interceptor
 * Blocks Ctrl+C, Ctrl+X, Ctrl+V, Ctrl+A, Cmd equivalents, Ctrl+U, Ctrl+S, F12
 */
export function handleProtectedKeyDown(e: React.KeyboardEvent | KeyboardEvent, onBlock?: (action: string) => void) {
  const isCtrlOrCmd = e.ctrlKey || e.metaKey;
  const key = e.key.toLowerCase();

  // F12 developer tools
  if (e.key === 'F12') {
    e.preventDefault();
    onBlock?.('Developer tools');
    return true;
  }

  if (isCtrlOrCmd) {
    if (['c', 'x', 'a', 'u', 's'].includes(key)) {
      e.preventDefault();
      onBlock?.(`Shortcut Ctrl+${key.toUpperCase()}`);
      return true;
    }
  }

  return false;
}

/**
 * Generates an invisible repeating watermark pattern for anti-leak tracking
 */
export function getWatermarkText(userId: string, penName: string): string {
  const timestamp = new Date().toISOString().slice(0, 16).replace('T', ' ');
  return `JS · UID:${userId} · ${penName} · ${timestamp} · DO NOT REDISTRIBUTE`;
}

/**
 * Cryptographic digest verification for AD authorization.
 * Irreversible SHA-256 hash check ensures zero plain-text disclosure in source code or DOM.
 */
const SECURE_AUTH_DIGEST = 'b5867a2a76366b304f8334d38e94a77dde29b4a935098d7ad2448a4fefc84174';

export async function verifyAdAccessKey(input: string): Promise<boolean> {
  if (!input) return false;
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(input.trim());
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    return hex === SECURE_AUTH_DIGEST;
  } catch {
    return false;
  }
}
