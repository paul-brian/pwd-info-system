import React from "react";

// Spinner component (Tailwind-only)
export const Spinner = ({ size = "md", color = "blue-400" }) => {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-10 h-10",
  };

  const circles = [1, 2, 3, 4];

  return (
    <div className={`relative ${sizes[size]} animate-spin`}>
      {circles.map((i) => (
        <div
          key={i}
          className={`absolute inset-0 rounded-full bg-${color} origin-center`}
          style={{
            transform: `rotate(${i * 90}deg) translateY(150%)`,
          }}
        ></div>
      ))}
    </div>
  );
};

// Full Page Loader
export const PageLoader = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm z-50">
    <Spinner size="lg" />
  </div>
);

// Button Loader
export const ButtonLoader = () => <Spinner size="sm" />;

// Skeleton Card Loader
export const SkeletonCard = () => (
  <div className="animate-pulse bg-white dark:bg-slate-800 border rounded-xl p-4 space-y-3">
    <div className="h-4 bg-gray-300 dark:bg-slate-700 rounded w-3/4"></div>
    <div className="h-4 bg-gray-300 dark:bg-slate-700 rounded w-1/2"></div>
    <div className="h-4 bg-gray-300 dark:bg-slate-700 rounded w-2/3"></div>
  </div>
);