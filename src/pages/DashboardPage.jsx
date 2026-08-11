import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { SearchBar } from "../components/SearchBar";
import { StatsSection } from "../components/Stats";
import { WordList, EmptyState } from "../components/WordCard";
import { ListSkeleton, StatsSkeleton } from "../components/Skeleton";
import { ConfirmationDialog } from "../components/Modal";
import { AddWordModal } from "../components/AddWordModal";
import vocabularyApi from "../services/api";
import { useVocabularyStore } from "../context/vocabularyStore";
// import { calculateStats } from "../utils/helpers";
import toast from "react-hot-toast";
import {
  SUCCESS_MESSAGES,
  ERROR_MESSAGES,
  DEFAULT_PAGE_SIZE,
} from "../constants/app";
import { BookOpen, Sparkles } from "lucide-react";
import { Button } from "../components/common";

/**
 * Dashboard / Home Page
 */
const DashboardPage = () => {
  const navigate = useNavigate();
  const store = useVocabularyStore();
  const [isLoading, setIsLoading] = useState(
    () => store.vocabularies.length === 0,
  );
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingWord, setEditingWord] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(false);

  // Load initial data
  useEffect(() => {
    let isActive = true;

    const fetchVocabularies = async () => {
      if (store.vocabularies.length > 0 && store.totalCount > 0) {
        setHasMorePages(store.vocabularies.length < store.totalCount);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await vocabularyApi.list(1, DEFAULT_PAGE_SIZE);
        if (!isActive) return;

        if (response.succeeded) {
          const items = Array.isArray(response.data.vocabularyEntries)
            ? response.data.vocabularyEntries
            : [];
          store.setVocabularies(items);
          if (response.data.totalCount) {
            store.setTotalCount(response.data.totalCount);
            // Check if there are more pages
            setHasMorePages(items.length < response.data.totalCount);
          } else if (items.length > 0) {
            store.setTotalCount(items.length);
            setHasMorePages(false);
          } else {
            setHasMorePages(false);
          }
          setCurrentPage(1);
        } else {
          toast.error(response.message || "Failed to load vocabularies");
        }
      } catch (error) {
        if (!isActive) return;
        toast.error(error.message || ERROR_MESSAGES.NETWORK_ERROR);
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    fetchVocabularies();

    return () => {
      isActive = false;
    };
  }, [store]);

  // const stats = calculateStats(store.vocabularies);
  const totalWords = store.totalCount || store.vocabularies.length;

  // Filter words based on search
  const filteredWords = store.vocabularies.filter((word) => {
    const query = searchQuery.toLowerCase();
    return (
      word?.word?.toLowerCase().includes(query) ||
      word?.definition?.toLowerCase().includes(query) ||
      word?.example?.toLowerCase().includes(query)
    );
  });

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

  const handleLoadMore = async () => {
    setIsLoadingMore(true);
    try {
      const nextPage = currentPage + 1;
      const response = await vocabularyApi.list(nextPage, DEFAULT_PAGE_SIZE);
      if (response.succeeded) {
        const newItems = Array.isArray(response.data.vocabularyEntries)
          ? response.data.vocabularyEntries
          : [];
        if (newItems.length > 0) {
          // Append new items to existing vocabularies
          store.setVocabularies([...store.vocabularies, ...newItems]);
          setCurrentPage(nextPage);

          // Check if there are more pages
          if (response.data.totalCount) {
            const totalLoaded = store.vocabularies.length + newItems.length;
            setHasMorePages(totalLoaded < response.data.totalCount);
          } else {
            setHasMorePages(false);
          }
        } else {
          setHasMorePages(false);
        }
      } else {
        toast.error(response.message || "Failed to load more words");
      }
    } catch (error) {
      toast.error(error.message || ERROR_MESSAGES.NETWORK_ERROR);
    } finally {
      setIsLoadingMore(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Hero section */}
      <div className="space-y-6 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2"
        >
          <div className="flex flex-col justify-between mb-5 md:mb-0">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl gradient-bg shadow-glow">
                <Sparkles size={24} className="text-white" />
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight">
                <span className="gradient-text">Lexora</span>
              </h1>
            </div>

            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-md">
              Master English vocabulary at your own pace - track, search, and
              grow your word collection.
            </p>
          </div>

          {/* Statistics */}
          {isLoading ? (
            <div className="">
              <StatsSkeleton />
            </div>
          ) : (
            <StatsSection totalWords={totalWords} />
          )}
        </motion.div>

        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search your words..."
          />
        </motion.div>
      </div>

      {/* Recent words section */}
      <div className="space-y-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-1 tracking-tight">
            {searchQuery ? "Search Results" : "Recent Words"}
          </h2>
          {!searchQuery && (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Your latest vocabulary entries
            </p>
          )}
        </motion.div>

        {isLoading ? (
          <ListSkeleton count={3} />
        ) : filteredWords.length > 0 ? (
          <WordList
            words={filteredWords}
            isLoading={false}
            onView={(word) => navigate(`/Lexora-Client/word/${word.id}`)}
            onEdit={(word) => setEditingWord(word)}
            onDelete={handleDelete}
            emptyMessage={
              searchQuery
                ? "No words match your search"
                : "No words yet. Add your first word!"
            }
          />
        ) : (
          <EmptyState
            message={
              searchQuery
                ? "No words match your search"
                : "No words yet. Add your first word to get started!"
            }
            icon={BookOpen}
          />
        )}

        {/* Load More Button */}
        {!searchQuery && hasMorePages && filteredWords.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center pt-6"
          >
            <Button
              variant="secondary"
              onClick={handleLoadMore}
              isLoading={isLoadingMore}
              disabled={isLoadingMore}
            >
              Load More Words
            </Button>
          </motion.div>
        )}
      </div>

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
        message="Are you sure you want to delete this word? This action cannot be undone."
        confirmText="Delete"
        isLoading={isDeleting}
        isDangerous={true}
      />
    </div>
  );
};

export default DashboardPage;
