import clsx from "clsx";

/**
 * Loading skeleton component
 */
export const Skeleton = ({ className, ...props }) => {
  return (
    <div
      className={clsx(
        "bg-slate-200/70 dark:bg-slate-800/70 rounded-xl animate-pulse",
        className,
      )}
      {...props}
    />
  );
};

/**
 * Word card skeleton
 */
export const WordCardSkeleton = () => {
  return (
    <div className="card p-5 space-y-4">
      <Skeleton className="h-5 w-28" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-4/5" />
      <div className="flex justify-between items-center pt-3 border-t border-slate-100 dark:border-slate-800/50">
        <Skeleton className="h-3 w-16" />
        <div className="flex gap-2">
          <Skeleton className="h-7 w-7 rounded-lg" />
          <Skeleton className="h-7 w-7 rounded-lg" />
        </div>
      </div>
    </div>
  );
};

/**
 * List skeleton
 */
export const ListSkeleton = ({ count = 3 }) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <WordCardSkeleton key={i} />
      ))}
    </div>
  );
};

/**
 * Stats skeleton
 */
export const StatsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Skeleton className="h-10 w-10 rounded-xl" />
    </div>
  );
};
