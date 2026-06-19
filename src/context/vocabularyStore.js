import { create } from "zustand";

/**
 * Zustand store for vocabulary state management
 */
export const useVocabularyStore = create((set) => ({
  // State
  vocabularies: [],
  currentVocabulary: null,
  isLoading: false,
  error: null,
  currentPage: 1,
  pageSize: 10,
  totalCount: 0,
  recentSearches: [],

  // Actions
  setVocabularies: (vocabularies) => set({ vocabularies }),
  setCurrentVocabulary: (vocabulary) => set({ currentVocabulary: vocabulary }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setPageSize: (pageSize) => set({ pageSize }),
  setTotalCount: (count) => set({ totalCount: count }),

  // Add word
  addVocabulary: (vocabulary) =>
    set((state) => ({
      vocabularies: [vocabulary, ...state.vocabularies],
      totalCount: state.totalCount + 1,
    })),

  // Update word
  updateVocabulary: (id, updatedData) =>
    set((state) => ({
      vocabularies: state.vocabularies.map((v) =>
        v.id === id ? { ...v, ...updatedData } : v,
      ),
      currentVocabulary:
        state.currentVocabulary?.id === id
          ? { ...state.currentVocabulary, ...updatedData }
          : state.currentVocabulary,
    })),

  // Delete word (soft delete)
  deleteVocabulary: (id) =>
    set((state) => ({
      vocabularies: state.vocabularies.filter((v) => v.id !== id),
      totalCount: state.totalCount - 1,
      currentVocabulary:
        state.currentVocabulary?.id === id ? null : state.currentVocabulary,
    })),

  // Add to recent searches
  addRecentSearch: (query) =>
    set((state) => {
      const updated = [
        query,
        ...state.recentSearches.filter((q) => q !== query),
      ].slice(0, 5);
      return { recentSearches: updated };
    }),

  // Clear recent searches
  clearRecentSearches: () => set({ recentSearches: [] }),

  // Reset store
  reset: () =>
    set({
      vocabularies: [],
      currentVocabulary: null,
      isLoading: false,
      error: null,
      currentPage: 1,
      pageSize: 10,
      totalCount: 0,
    }),
}));
