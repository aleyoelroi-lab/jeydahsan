/**
 * Jeydahsan Platform Constants
 * Configurable limits and design specifications
 */

// 1 page = 300 words
export const WORDS_PER_PAGE = 300;

// Maximum 500 pages per book (= 150,000 words)
export const MAX_PAGES_PER_BOOK = 500;

// Maximum 7 PUBLIC books per user at any time
export const MAX_PUBLIC_BOOKS_PER_USER = 7;

// Rate limits
export const MAX_REPORTS_PER_DAY = 10;
export const MAX_CONTACT_REQUESTS_PER_DAY = 10;
export const MAX_CONTACT_REQUESTS_SAME_AUTHOR_YEAR = 5;

// Theme color definitions
export const THEME_COLORS = {
  light: {
    bg: '#FDFBF4',
    surface: '#FFFFFF',
    primaryAccent: '#9CAF88',
    deepAccent: '#6E8B5E',
    text: '#1C1C1A',
    mutedText: '#5C5F58',
    border: '#E4E0D4',
  },
  night: {
    bg: '#12140F',
    surface: '#1B1E17',
    primaryAccent: '#A3B899',
    deepAccent: '#6E8B5E',
    text: '#E8E6DE',
    mutedText: '#8C9087',
    border: '#2C3128',
  },
};
