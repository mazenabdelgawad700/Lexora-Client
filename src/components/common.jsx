import React from "react";
import clsx from "clsx";
import { motion } from "framer-motion";

/**
 * Button component
 */
export const Button = React.forwardRef(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled = false,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const variants = {
      primary: "btn-primary",
      secondary: "btn-secondary",
      ghost: "btn-ghost",
      danger: "btn-danger",
    };

    const sizes = {
      sm: "py-1.5 px-3 text-sm",
      md: "py-2.5 px-5",
      lg: "py-3 px-6 text-lg",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={clsx(
          variants[variant],
          sizes[size],
          "font-medium rounded-xl transition-all duration-200 inline-flex items-center gap-2",
          isLoading && "opacity-70 cursor-wait",
          disabled && "opacity-50 cursor-not-allowed",
          className,
        )}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            Loading...
          </span>
        ) : (
          children
        )}
      </button>
    );
  },
);

Button.displayName = "Button";

/**
 * Input component
 */
export const Input = React.forwardRef(
  ({ className, error, label, helperText, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={clsx(
            "input-base",
            error &&
              "border-red-500 focus:border-red-500 focus:ring-red-500/10",
            className,
          )}
          {...props}
        />
        {error && <p className="mt-1.5 text-sm text-red-500 font-medium">{error}</p>}
        {helperText && !error && (
          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

/**
 * Textarea component
 */
export const Textarea = React.forwardRef(
  ({ className, error, label, helperText, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={clsx(
            "input-base min-h-[120px] resize-none",
            error &&
              "border-red-500 focus:border-red-500 focus:ring-red-500/10",
            className,
          )}
          {...props}
        />
        {error && <p className="mt-1.5 text-sm text-red-500 font-medium">{error}</p>}
        {helperText && !error && (
          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";

/**
 * Card component with optional animation
 */
export const Card = ({ className, animate = false, children, ...props }) => {
  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={clsx("card", className)}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={clsx("card", className)} {...props}>
      {children}
    </div>
  );
};

/**
 * Badge component
 */
export const Badge = ({
  variant = "default",
  className,
  children,
  ...props
}) => {
  const variants = {
    default: "bg-accent-100 dark:bg-accent-900/30 text-accent-700 dark:text-accent-300",
    success:
      "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300",
    warning:
      "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300",
    error: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300",
  };

  return (
    <span
      className={clsx(
        "inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wide",
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
};

/**
 * Spinner component
 */
export const Spinner = ({ size = "md", className }) => {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div
      className={clsx(
        "border-4 border-slate-200 dark:border-slate-700 border-t-accent-500 rounded-full animate-spin",
        sizes[size],
        className,
      )}
    />
  );
};
