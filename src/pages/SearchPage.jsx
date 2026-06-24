import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Zap, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { SearchBar, SearchModeTabs } from "../components/SearchBar";
import { WordList, EmptyState } from "../components/WordCard";
import { ListSkeleton } from "../components/Skeleton";
import { ConfirmationDialog } from "../components/Modal";
import { AddWordModal } from "../components/AddWordModal";
import vocabularyApi from "../services/api";
import { useVocabularyStore } from "../context/vocabularyStore";
import { SEARCH_MODES } from "../constants/app";
import toast from "react-hot-toast";
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from "../constants/app";


const SearchPage = () => {
  const navigate = useNavigate();
  const [searchMode, setSearchMode] = useState(SEARCH_MODES.WORD);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState(() => {
    const stored = localStorage.getItem("lexora_recent_searches");

    return stored ? JSON.parse(stored) : [];
  });
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingWord, setEditingWord] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const store = useVocabularyStore();

  const handleSearch = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    setHasSearched(true);
    setIsLoading(true);
    try {
      let response;

      if (searchMode === SEARCH_MODES.WORD) {
        response = await vocabularyApi.searchByWord(searchQuery);
      } else if (searchMode === SEARCH_MODES.DEFINITION) {
        response = await vocabularyApi.searchByDefinition(searchQuery);
      } else {
        response = await vocabularyApi.searchByExample(searchQuery);
      }

      if (response.succeeded) {
        setResults(
          Array.isArray(response.data.results) ? response.data.results : [],
        );

        // Save to recent searches
        const updated = [
          searchQuery,
          ...recentSearches.filter((q) => q !== searchQuery),
        ].slice(0, 5);
        setRecentSearches(updated);
        localStorage.setItem("lexora_recent_searches", JSON.stringify(updated));
      } else {
        toast.error(response.message || "Search failed");
      }
    } catch (error) {
      toast.error(error.message || ERROR_MESSAGES.NETWORK_ERROR);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchModeChange = (mode) => {
    setSearchMode(mode);
    setHasSearched(false);
    setQuery("");
    setResults([]);
  };

  const handleDelete = async (word) => {
    setDeleteConfirm(word);
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;

    setIsDeleting(true);
    try {
      const response = await vocabularyApi.delete(deleteConfirm.id);
      if (response.succeeded) {
        store.deleteVocabulary(deleteConfirm.id);
        setResults((prev) => prev.filter((w) => w.id !== deleteConfirm.id));
        toast.success(SUCCESS_MESSAGES.WORD_DELETED);
      } else {
        toast.error(response.message || ERROR_MESSAGES.SERVER_ERROR);
      }
    } catch (error) {
      toast.error(error.message || ERROR_MESSAGES.NETWORK_ERROR);
    } finally {
      setIsDeleting(false);
      setDeleteConfirm(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-2 mb-8"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-accent-500 to-purple-600 shadow-sm">
            <Search size={20} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">
            Search Vocabulary
          </h1>
        </div>
        <p className="text-slate-500 dark:text-slate-400 ml-12">
          Find words by searching across different categories
        </p>
      </motion.div>
      {/* Search mode tabs */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="mb-6"
      >
        <SearchModeTabs
          activeMode={searchMode}
          onChange={handleSearchModeChange}
        />
      </motion.div>
      {/* Search bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="mb-8"
      >
        <SearchBar
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onSearch={() => handleSearch(query)}
          isLoading={isLoading}
          placeholder={`Search by ${searchMode}...`}
        />
      </motion.div>
      {/* Recent searches */}
      {!query && results.length === 0 && recentSearches.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8 space-y-3"
        >
          <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <Zap size={14} className="text-amber-500" />
            Recent Searches
          </h2>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((search, i) => (
              <button
                key={i}
                onClick={() => {
                  setQuery(search);
                  handleSearch(search);
                }}
                className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/70 hover:bg-accent-50 dark:hover:bg-accent-900/20 hover:text-accent-600 dark:hover:text-accent-400 transition-all duration-200 text-sm font-medium text-slate-600 dark:text-slate-400"
              >
                {search}
              </button>
            ))}
          </div>
        </motion.div>
      )}
      {/* Results */}
      {isLoading && <ListSkeleton count={3} />}
      {!isLoading && query && results.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
            Found {results.length} result{results.length !== 1 ? "s" : ""}
          </p>
          <WordList
            words={results}
            isLoading={false}
            onView={(word) => navigate(`/Lexora-Client/word/${word.id}`)}
            onEdit={(word) => setEditingWord(word)}
            onDelete={handleDelete}
            emptyMessage="No results found"
          />
        </motion.div>
      )}

      {hasSearched && !isLoading && query && results.length === 0 && (
        <EmptyState
          message="No words found matching your search"
          icon={Search}
        />
      )}
      {!query && results.length === 0 && recentSearches.length === 0 && (
        <EmptyState message="Start searching to find words" icon={BookOpen} />
      )}
      {/* Edit word modal */}
      <AddWordModal
        isOpen={!!editingWord}
        onClose={() => setEditingWord(null)}
        editingWord={editingWord}
        onSuccess={() => setEditingWord(null)}
      />
      {/* Delete confirmation */}
      <ConfirmationDialog
        isOpen={!!deleteConfirm}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirm(null)}
        title="Delete Word"
        message="Are you sure you want to delete this word?"
        confirmText="Delete"
        isLoading={isDeleting}
        isDangerous={true}
      />
    </div>
  );
};

export default SearchPage;
