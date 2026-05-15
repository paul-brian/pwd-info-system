import React from "react";

// ─────────────────────────────────────────────
// 1. SKELETON — pang-table rows / cards
// ─────────────────────────────────────────────
export const SkeletonRow = ({ cols = 5 }) => (
  <tr className="animate-pulse">
    {Array.from({ length: cols }).map((_, i) => (
      <td key={i} className="px-4 py-3">
        <div className={`h-3 rounded-full bg-slate-200 dark:bg-slate-700 ${i === 0 ? "w-24" : i === cols - 1 ? "w-16 ml-auto" : "w-full"}`} />
      </td>
    ))}
  </tr>
);

export const SkeletonCard = () => (
  <div className="animate-pulse bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-3">
    <div className="flex items-center justify-between">
      <div className="h-3 w-28 rounded-full bg-slate-200 dark:bg-slate-700" />
      <div className="h-5 w-14 rounded-lg bg-slate-200 dark:bg-slate-700" />
    </div>
    <div className="h-3 w-full rounded-full bg-slate-200 dark:bg-slate-700" />
    <div className="h-3 w-3/4 rounded-full bg-slate-200 dark:bg-slate-700" />
    <div className="flex gap-2 pt-1">
      <div className="h-3 w-20 rounded-full bg-slate-200 dark:bg-slate-700" />
      <div className="h-3 w-16 rounded-full bg-slate-200 dark:bg-slate-700" />
    </div>
  </div>
);

export const SkeletonStatCard = () => (
  <div className="animate-pulse bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 space-y-3">
    <div className="w-10 h-10 rounded-lg bg-slate-200 dark:bg-slate-700" />
    <div className="h-2.5 w-24 rounded-full bg-slate-200 dark:bg-slate-700" />
    <div className="h-7 w-16 rounded-lg bg-slate-200 dark:bg-slate-700" />
  </div>
);

// ─────────────────────────────────────────────
// 2. SPINNER — pang inline o full section
// ─────────────────────────────────────────────
export const Spinner = ({ size = "md", color = "primary" }) => {
  const sizes = {
    sm: "w-5 h-5 border-2",
    md: "w-8 h-8 border-[3px]",
    lg: "w-12 h-12 border-4",
  };
  const colors = {
    primary: "border-primary/20 border-t-primary",
    white:   "border-white/20 border-t-white",
    slate:   "border-slate-200 border-t-slate-500 dark:border-slate-700 dark:border-t-slate-300",
  };
  return (
    <div className={`rounded-full animate-spin flex-shrink-0 ${sizes[size]} ${colors[color]}`} />
  );
};

// ─────────────────────────────────────────────
// 3. SECTION LOADER — pang buong section/page
// ─────────────────────────────────────────────
export const SectionLoader = ({ message = "Loading data..." }) => (
  <div className="flex flex-col items-center justify-center py-16 sm:py-24 gap-4">
    <div className="relative">
      {/* Outer ring */}
      <div className="w-14 h-14 rounded-full border-4 border-slate-200 dark:border-slate-700 animate-pulse" />
      {/* Spinner */}
      <div className="absolute inset-0 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    </div>
    <div className="text-center space-y-1">
      <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">{message}</p>
      <div className="flex items-center justify-center gap-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────────────
// 4. TABLE SKELETON — pang DataTable
// ─────────────────────────────────────────────
export const TableLoader = ({ rows = 5, cols = 5 }) => (
  <div className="overflow-x-auto">
    <table className="min-w-[1200px] w-full">
      <tbody>
        {Array.from({ length: rows }).map((_, i) => (
          <SkeletonRow key={i} cols={cols} />
        ))}
      </tbody>
    </table>
  </div>
);

// ─────────────────────────────────────────────
// 5. CARD GRID SKELETON — pang mobile cards
// ─────────────────────────────────────────────
export const CardGridLoader = ({ count = 4 }) => (
  <div className="flex flex-col gap-3">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

// ─────────────────────────────────────────────
// 6. STAT CARDS SKELETON — pang stats grid
// ─────────────────────────────────────────────
export const StatCardsLoader = ({ count = 4 }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonStatCard key={i} />
    ))}
  </div>
);

// ─────────────────────────────────────────────
// 7. PAGE LOADER — buong page loading
// ─────────────────────────────────────────────
export const PageLoader = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm">
    <div className="flex flex-col items-center gap-5">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center shadow-lg shadow-primary/10">
        <span className="material-symbols-outlined text-primary text-3xl animate-pulse">
          accessible_forward
        </span>
      </div>
      <div className="text-center space-y-1.5">
        <p className="text-base font-bold text-slate-800 dark:text-white">PWD System</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">Loading, please wait...</p>
      </div>
      <div className="flex gap-1.5">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className="w-2 h-2 rounded-full bg-primary animate-bounce"
            style={{ animationDelay: `${i * 0.12}s` }}
          />
        ))}
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────────────
// 8. INLINE LOADER — pang buttons
// ─────────────────────────────────────────────
export const ButtonLoader = ({ text = "Loading..." }) => (
  <span className="inline-flex items-center gap-2">
    <Spinner size="sm" color="white" />
    {text}
  </span>
);

export default {
  SkeletonRow,
  SkeletonCard,
  SkeletonStatCard,
  TableLoader,
  CardGridLoader,
  StatCardsLoader,
  SectionLoader,
  PageLoader,
  ButtonLoader,
  Spinner,
};