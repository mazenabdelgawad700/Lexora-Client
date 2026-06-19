/**
 * Debounce function
 */
export function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

/**
 * Highlight text with matched portions
 */
export function highlightText(text, query) {
  if (!query) return text;

  const regex = new RegExp(`(${query})`, "gi");
  return text.replace(regex, "<mark>$1</mark>");
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text, length = 100) {
  if (!text || text.length <= length) return text;
  return text.substring(0, length) + "...";
}

/**
 * Format date
 */
export function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Format time ago
 */
export function formatTimeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const secondsAgo = Math.floor((now - date) / 1000);

  if (secondsAgo < 60) return "just now";
  if (secondsAgo < 3600) return `${Math.floor(secondsAgo / 60)}m ago`;
  if (secondsAgo < 86400) return `${Math.floor(secondsAgo / 3600)}h ago`;
  if (secondsAgo < 604800) return `${Math.floor(secondsAgo / 86400)}d ago`;

  return formatDate(dateString);
}

/**
 * Validate vocabulary form
 */
export function validateVocabularyForm(formData) {
  const errors = [];

  if (!formData.word?.trim()) {
    errors.push("Word is required");
  }

  if (!formData.definition?.trim()) {
    errors.push("Definition is required");
  }

  if (!formData.example?.trim()) {
    errors.push("Example is required");
  }

  if (formData.word && formData.word.length > 100) {
    errors.push("Word must be less than 100 characters");
  }

  if (formData.definition && formData.definition.length > 500) {
    errors.push("Definition must be less than 500 characters");
  }

  if (formData.example && formData.example.length > 500) {
    errors.push("Example must be less than 500 characters");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Trim form data
 */
export function trimFormData(formData) {
  return {
    word: formData.word?.trim() || "",
    definition: formData.definition?.trim() || "",
    example: formData.example?.trim() || "",
  };
}

/**
 * Group words by date
 */
export function groupWordsByDate(words) {
  const groups = {};

  words.forEach((word) => {
    const date = formatDate(word.createdAt);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(word);
  });

  return groups;
}

/**
 * Calculate statistics
 */
export function calculateStats(words) {
  return {
    latest: words[0] || null,
  };
}
