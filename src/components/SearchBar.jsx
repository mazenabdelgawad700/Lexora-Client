import React from "react";
import { Search } from "lucide-react";
import { Button } from "./common";
import { SEARCH_MODES } from "../constants/app";
import clsx from "clsx";

/**
 * Search bar component with glow focus
 */
export const SearchBar = ({
  value,
  onChange,
  placeholder = "Search words, definitions, examples...",
  onSearch,
  isLoading = false,
  className,
}) => {
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && onSearch) {
      onSearch();
    }
  };

  return (
    <div className={clsx("flex gap-3", className)}>
      <div className="relative flex-1 group">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none transition-colors group-focus-within:text-accent-500"
        />
        <input
          type="text"
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="input-base pl-11 focus:shadow-glow"
        />
      </div>
      {onSearch && (
        <Button variant="primary" onClick={onSearch} isLoading={isLoading}>
          Search
        </Button>
      )}
    </div>
  );
};

/**
 * Search mode tabs component
 */
export const SearchModeTabs = ({ activeMode, onChange }) => {
  const modes = [
    { value: SEARCH_MODES.WORD, label: "By Word" },
    { value: SEARCH_MODES.DEFINITION, label: "By Definition" },
    { value: SEARCH_MODES.EXAMPLE, label: "By Example" },
  ];

  return (
    <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800/50 rounded-xl">
      {modes.map((mode) => (
        <button
          key={mode.value}
          onClick={() => onChange(mode.value)}
          className={clsx(
            "flex-1 px-4 py-2.5 font-medium text-sm rounded-lg transition-all duration-200",
            activeMode === mode.value
              ? "bg-white dark:bg-slate-800 text-accent-600 dark:text-accent-400 shadow-sm"
              : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300",
          )}
        >
          {mode.label}
        </button>
      ))}
    </div>
  );
};
