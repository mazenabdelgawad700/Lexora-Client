import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Edit2, Trash2, Calendar, BookOpen, Quote } from "lucide-react";
import { motion } from "framer-motion";
import { Button, Card, Spinner } from "../components/common";
import { ConfirmationDialog } from "../components/Modal";
import { AddWordModal } from "../components/AddWordModal";
import vocabularyApi from "../services/api";
import { useVocabularyStore } from "../context/vocabularyStore";
import toast from "react-hot-toast";
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from "../constants/app";
import { formatDate } from "../utils/helpers";

/**
 * Word Details Page
 */
const WordDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [word, setWord] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const store = useVocabularyStore();

  useEffect(() => {
    const fetchWord = async () => {
      setIsLoading(true);
      try {
        const response = await vocabularyApi.getById(id);
        if (response.succeeded) {
          setWord(response.data);
        } else {
          toast.error(response.message || "Failed to load word");
          navigate("/");
        }
      } catch (error) {
        toast.error(error.message || ERROR_MESSAGES.NETWORK_ERROR);
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };

    fetchWord();
  }, [id, navigate]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await vocabularyApi.delete(id);
      if (response.succeeded) {
        store.deleteVocabulary(id);
        toast.success(SUCCESS_MESSAGES.WORD_DELETED);
        navigate("/");
      } else {
        toast.error(response.message || ERROR_MESSAGES.SERVER_ERROR);
      }
    } catch (error) {
      toast.error(error.message || ERROR_MESSAGES.NETWORK_ERROR);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-24">
          <div className="flex flex-col items-center gap-4">
            <Spinner size="lg" />
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Loading word details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!word) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="card p-16 text-center">
          <p className="text-slate-500 dark:text-slate-400 font-medium">Word not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Back button */}
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-accent-500 mb-8 transition-colors group"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
        Back
      </motion.button>

      {/* Word details */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="p-8 space-y-8 overflow-hidden relative">
          {/* Decorative accent */}
          <div className="absolute top-0 left-0 right-0 h-1 gradient-bg" />

          {/* Header */}
          <div className="flex items-start justify-between pt-2">
            <div>
              <h1 className="text-4xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
                {word.word}
              </h1>
            </div>

            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={() => setIsEditing(true)}>
                <Edit2 size={16} />
                Edit
              </Button>
              <Button variant="danger" size="sm" onClick={() => setShowDeleteConfirm(true)}>
                <Trash2 size={16} />
                Delete
              </Button>
            </div>
          </div>

          {/* Definition */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-accent-600 dark:text-accent-400">
              <BookOpen size={18} />
              <h2 className="text-sm font-bold uppercase tracking-wider">
                Definition
              </h2>
            </div>
            <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed pl-7">
              {word.definition}
            </p>
          </div>

          {/* Divider */}
          <div className="border-t border-slate-100 dark:border-slate-800/50" />

          {/* Example */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
              <Quote size={18} />
              <h2 className="text-sm font-bold uppercase tracking-wider">
                Example
              </h2>
            </div>
            <div className="pl-7">
              <blockquote className="text-base text-slate-600 dark:text-slate-400 italic leading-relaxed border-l-2 border-accent-300 dark:border-accent-700 pl-4">
                "{word.example}"
              </blockquote>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Edit modal */}
      <AddWordModal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        editingWord={word}
        onSuccess={() => {
          // Refetch word data
          const updated = store.vocabularies.find((v) => v.id === id);
          if (updated) setWord(updated);
        }}
      />

      {/* Delete confirmation */}
      <ConfirmationDialog
        isOpen={showDeleteConfirm}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
        title="Delete Word"
        message="Are you sure you want to delete this word? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={isDeleting}
        isDangerous={true}
      />
    </div>
  );
};

export default WordDetailsPage;
