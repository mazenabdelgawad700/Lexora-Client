import { useState } from "react";
import { Heart, Edit2, Trash2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { truncate } from "../utils/helpers";
import clsx from "clsx";

const cardVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, delay: i * 0.06, ease: "easeOut" },
  }),
};

/**
 * Word card component with accent bar and hover effects
 */
export const WordCard = ({
  word,
  onView,
  onEdit,
  onDelete,
  isLoading = false,
  index = 0,
}) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavorite = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      onClick={() => onView(word)}
      className="card-hover p-5 group relative overflow-hidden"
    >
      {/* Accent gradient bar */}
      <div className="absolute left-0 top-0 bottom-0 w-1 gradient-bg rounded-l-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50 tracking-tight">
          {word.word}
        </h3>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={handleFavorite}
            className={clsx(
              "p-1.5 rounded-lg transition-all duration-200",
              isFavorite
                ? "bg-red-50 dark:bg-red-900/20 text-red-500"
                : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400",
            )}
          >
            <Heart size={16} fill={isFavorite ? "currentColor" : "none"} />
          </button>
        </div>
      </div>

      {/* Definition preview */}
      <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-2">
        <span className="font-semibold text-slate-700 dark:text-slate-300">
          Definition:
        </span>{" "}
        {truncate(word.definition, 100)}
      </p>

      {/* Example preview */}
      <p className="text-sm text-slate-500 dark:text-slate-500 line-clamp-1 italic mb-4">
        "{truncate(word.example, 80)}"
      </p>

      {/* Meta info */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/50">
        {/* Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(word);
            }}
            disabled={isLoading}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-accent-500 transition-all duration-200 disabled:opacity-50"
            title="Edit word"
          >
            <Edit2 size={15} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(word);
            }}
            disabled={isLoading}
            className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-500 transition-all duration-200 disabled:opacity-50"
            title="Delete word"
          >
            <Trash2 size={15} />
          </button>
          <ArrowRight
            size={15}
            className="text-slate-300 dark:text-slate-600 ml-1"
          />
        </div>
      </div>
    </motion.div>
  );
};

/**
 * Word list component with staggered animations
 */
export const WordList = ({
  words,
  isLoading,
  onView,
  onEdit,
  onDelete,
  emptyMessage,
}) => {
  if (words.length === 0 && !isLoading) {
    return <EmptyState message={emptyMessage || "No words found"} />;
  }

  return (
    <div className="space-y-3">
      {words.map((word, index) => (
        <WordCard
          key={word.id}
          word={word}
          onView={() => onView(word)}
          onEdit={onEdit}
          onDelete={onDelete}
          isLoading={isLoading}
          index={index}
        />
      ))}
    </div>
  );
};

/**
 * Empty state component with animation
 */
export const EmptyState = ({ message = "No data found", icon: Icon }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="card p-16 text-center space-y-4"
    >
      {Icon && (
        <div className="flex justify-center">
          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800">
            <Icon size={40} className="text-slate-400 dark:text-slate-500" />
          </div>
        </div>
      )}
      <p className="text-slate-500 dark:text-slate-400 font-medium">
        {message}
      </p>
    </motion.div>
  );
};
