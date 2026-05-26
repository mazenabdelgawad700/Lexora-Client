import React from "react";
import { Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../hooks";

/**
 * Animated theme toggle button
 */
export const ThemeToggle = () => {
  const { theme, toggleTheme, isLoading } = useTheme();

  if (isLoading) return null;

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 group"
      aria-label="Toggle theme"
      title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      <AnimatePresence mode="wait" initial={false}>
        {theme === "light" ? (
          <motion.div
            key="moon"
            initial={{ rotate: -90, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            exit={{ rotate: 90, scale: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Moon size={18} className="text-slate-700 group-hover:text-accent-600 transition-colors" />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ rotate: 90, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            exit={{ rotate: -90, scale: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Sun size={18} className="text-slate-300 group-hover:text-amber-400 transition-colors" />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
};
