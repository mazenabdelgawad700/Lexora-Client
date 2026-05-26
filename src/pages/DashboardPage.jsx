import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SearchBar } from '../components/SearchBar';
import { StatsSection } from '../components/Stats';
import { WordList, EmptyState } from '../components/WordCard';
import { ListSkeleton, StatsSkeleton } from '../components/Skeleton';
import { ConfirmationDialog } from '../components/Modal';
import { AddWordModal } from '../components/AddWordModal';
import vocabularyApi from '../services/api';
import { useVocabularyStore } from '../context/vocabularyStore';
import { calculateStats } from '../utils/helpers';
import toast from 'react-hot-toast';
import { SUCCESS_MESSAGES, ERROR_MESSAGES, DEFAULT_PAGE_SIZE } from '../constants/app';
import { BookOpen, Sparkles } from 'lucide-react';

/**
 * Dashboard / Home Page
 */
const DashboardPage = ({ onAddWord }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingWord, setEditingWord] = useState(null);

  const store = useVocabularyStore();

  // Load initial data
  useEffect(() => {
    const fetchVocabularies = async () => {
      setIsLoading(true);
      try {
        const response = await vocabularyApi.list(1, DEFAULT_PAGE_SIZE);
        if (response.succeeded) {
          const items = Array.isArray(response.data.vocabularyEntries) ? response.data.vocabularyEntries : [];
          store.setVocabularies(items);
          if (response.data.totalCount) {
            store.setTotalCount(response.data.totalCount);
          } else if (items.length > 0) {
            store.setTotalCount(items.length);
          }
        } else {
          toast.error(response.message || 'Failed to load vocabularies');
        }
      } catch (error) {
        toast.error(error.message || ERROR_MESSAGES.NETWORK_ERROR);
      } finally {
        setIsLoading(false);
      }
    };

    if (store.vocabularies.length === 0) {
      fetchVocabularies();
    } else {
      setIsLoading(false);
    }
  }, []);

  const stats = calculateStats(store.vocabularies);

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

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Hero section */}
      <div className="space-y-6 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-3"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl gradient-bg shadow-glow">
              <Sparkles size={24} className="text-white" />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight">
              <span className="gradient-text">Lexora</span>
            </h1>
          </div>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-md">
            Master English vocabulary at your own pace — track, search, and grow your word collection.
          </p>
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

      {/* Statistics */}
      {isLoading ? (
        <div className="mb-12">
          <StatsSkeleton />
        </div>
      ) : (
        <div className="mb-12">
          <StatsSection
            totalWords={stats.total}
            wordsThisWeek={stats.thisWeek}
            latestWord={stats.latest}
          />
        </div>
      )}

      {/* Recent words section */}
      <div className="space-y-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-1 tracking-tight">
            {searchQuery ? 'Search Results' : 'Recent Words'}
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
            onView={(word) => navigate(`/word/${word.id}`)}
            onEdit={(word) => setEditingWord(word)}
            onDelete={handleDelete}
            emptyMessage={
              searchQuery
                ? 'No words match your search'
                : 'No words yet. Add your first word!'
            }
          />
        ) : (
          <EmptyState
            message={
              searchQuery
                ? 'No words match your search'
                : 'No words yet. Add your first word to get started!'
            }
            icon={BookOpen}
          />
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
