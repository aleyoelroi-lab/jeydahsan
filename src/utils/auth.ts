import { User } from '../types/truewriters';
import { CURRENT_USER } from '../data/mockData';

export const STORAGE_KEY_SESSION = 'jeydahsan_current_user_session';
export const STORAGE_KEY_USERS = 'jeydahsan_registered_users';

export const GUEST_USER: User = {
  id: 'guest',
  penName: 'Guest Reader',
  email: '',
  emailVerified: false,
  role: 'reader',
  joinedDate: 'October 2026',
  followersCount: 0,
  followingCount: 0,
  ageVerified13Plus: true,
  isGuest: true,
};

/**
 * Retrieves the currently active user session from localStorage,
 * falling back to CURRENT_USER for first-time demo consistency.
 */
export function getStoredSession(): User {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SESSION);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.id) return parsed;
    }
  } catch (err) {
    console.error('Error reading user session:', err);
  }
  return CURRENT_USER;
}

export function setStoredSession(user: User): void {
  try {
    localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(user));
  } catch (err) {
    console.error('Error saving user session:', err);
  }
}

export function clearStoredSession(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_SESSION);
  } catch (err) {
    console.error('Error clearing user session:', err);
  }
}

/**
 * Returns all registered users on this client device.
 */
export function getRegisteredUsers(): User[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USERS);
    if (raw) {
      const list = JSON.parse(raw);
      if (Array.isArray(list)) return list;
    }
  } catch (err) {
    console.error('Error reading registered users:', err);
  }
  // Initialize with Rowan Vance
  return [CURRENT_USER];
}

/**
 * Upserts a user in the registered users list in localStorage.
 */
export function saveRegisteredUser(user: User): void {
  try {
    const existing = getRegisteredUsers();
    const index = existing.findIndex(
      (u) => u.id === user.id || u.email.toLowerCase() === user.email.toLowerCase()
    );
    if (index >= 0) {
      existing[index] = { ...existing[index], ...user };
    } else {
      existing.push(user);
    }
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(existing));
  } catch (err) {
    console.error('Error saving registered user:', err);
  }
}

export function findUserByEmail(email: string): User | undefined {
  if (!email) return undefined;
  const list = getRegisteredUsers();
  return list.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
}

/**
 * Generates an email message verification URL with token
 */
export function generateVerificationLink(email: string, token: string): string {
  const origin = window.location.origin || '';
  const pathname = window.location.pathname || '';
  return `${origin}${pathname}?verify_token=${encodeURIComponent(token)}&email=${encodeURIComponent(email.trim().toLowerCase())}`;
}

export function generateToken(): string {
  return Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
}
