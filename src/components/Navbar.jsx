import React from "react";
import { Link, useLocation } from "react-router-dom";
import { BookOpen, Search } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "./common";

/**
 * Navbar component with glassmorphism
 */
export const Navbar = ({ onAddClick }) => {
  const location = useLocation();

  return (
    <nav className="glass sticky top-0 z-40 border-b border-slate-200/50 dark:border-slate-800/50">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5 group"
        >
          <div className="p-1.5 rounded-lg gradient-bg shadow-sm group-hover:shadow-glow transition-shadow duration-300">
            <BookOpen size={20} className="text-white" />
          </div>
          <span className="text-xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">
            Lexora
          </span>
        </Link>

        {/* Navigation links */}
        <div className="hidden sm:flex items-center gap-1">
          <Link
            to="/"
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              location.pathname === "/"
                ? "bg-accent-50 dark:bg-accent-900/20 text-accent-600 dark:text-accent-400"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            Dashboard
          </Link>
          <Link
            to="/search"
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
              location.pathname === "/search"
                ? "bg-accent-50 dark:bg-accent-900/20 text-accent-600 dark:text-accent-400"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Search size={15} />
            Search
          </Link>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2">
          <Button variant="primary" size="sm" onClick={onAddClick}>
            + Add Word
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
};
