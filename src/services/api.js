import { API_BASE_URL, API_TIMEOUT } from "../constants/app.js";

/**
 * Fetch wrapper with error handling and timeout
 */
async function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

/**
 * API Service for vocabulary endpoints
 */
const vocabularyApi = {
  /**
   * Create new vocabulary
   */
  async create(data) {
    const response = await fetchWithTimeout(`${API_BASE_URL}/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Word: data.word,
        Definition: data.definition,
        Example: data.example,
      }),
    });
    return response;
  },

  /**
   * Get vocabulary by ID
   */
  async getById(id) {
    const response = await fetchWithTimeout(`${API_BASE_URL}/${id}`);
    return response;
  },

  /**
   * List all vocabulary with pagination
   */
  async list(page = 1, pageSize = 10) {
    const response = await fetchWithTimeout(
      `${API_BASE_URL}/list?page=${page}&pageSize=${pageSize}`,
    );
    return response;
  },

  /**
   * Search by word
   */
  async searchByWord(query) {
    const response = await fetchWithTimeout(
      `${API_BASE_URL}/search-by-word?searchQuery=${encodeURIComponent(query)}`,
    );
    return response;
  },

  /**
   * Search by definition
   */
  async searchByDefinition(query) {
    const response = await fetchWithTimeout(
      `${API_BASE_URL}/search-by-definition?searchQuery=${encodeURIComponent(query)}`,
    );
    return response;
  },

  /**
   * Search by example
   */
  async searchByExample(query) {
    const response = await fetchWithTimeout(
      `${API_BASE_URL}/search-by-example?searchQuery=${encodeURIComponent(query)}`,
    );
    return response;
  },

  /**
   * Update vocabulary
   */
  async update(data) {
    const response = await fetchWithTimeout(`${API_BASE_URL}/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: data.id,
        word: data.word,
        definition: data.definition,
        example: data.example,
      }),
    });
    return response;
  },

  /**
   * Delete vocabulary (soft delete)
   */
  async delete(id) {
    const response = await fetchWithTimeout(`${API_BASE_URL}/delete/${id}`, {
      method: "DELETE",
    });
    return response;
  },
};

export default vocabularyApi;
