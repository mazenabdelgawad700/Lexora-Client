// API Configuration
export const API_BASE_URL = "http://lexora.runasp.net/api/v1/vocabulary";
export const API_TIMEOUT = 10000;

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_PAGE = 1;

// Search modes
export const SEARCH_MODES = {
  WORD: "word",
  DEFINITION: "definition",
  EXAMPLE: "example",
};

// Local storage keys
export const STORAGE_KEYS = {
  THEME: "lexora_theme",
  RECENT_SEARCHES: "lexora_recent_searches",
  USER_CACHE: "lexora_cache",
};

// Debounce delays (in ms)
export const DEBOUNCE_DELAYS = {
  SEARCH: 300,
  INPUT: 200,
};

// Toast duration (in ms)
export const TOAST_DURATION = 3000;

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Network error. Please check your connection.",
  INVALID_INPUT: "Please fill in all fields correctly.",
  WORD_EXISTS: "This word already exists.",
  NOT_FOUND: "Word not found.",
  SERVER_ERROR: "Server error. Please try again later.",
};

// Success messages
export const SUCCESS_MESSAGES = {
  WORD_ADDED: "Word added successfully!",
  WORD_UPDATED: "Word updated successfully!",
  WORD_DELETED: "Word deleted successfully!",
};
