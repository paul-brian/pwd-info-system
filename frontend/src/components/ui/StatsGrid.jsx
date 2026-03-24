const StatsGrid = ({ children }) => {
  const count = Array.isArray(children) ? children.length : 1;

  const gridClass =
    count === 1 ? "grid-cols-1" :
    count === 2 ? "grid-cols-2" :
    count === 3 ? "grid-cols-1 sm:grid-cols-3" :        // ← 3 cards: 1 col mobile, 3 col sm+
    count === 4 ? "grid-cols-2 sm:grid-cols-4" :        // ← 4 cards: 2x2 mobile, 4 col sm+
    count === 6 ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6" : // ← 6 cards
    "grid-cols-2 sm:grid-cols-4";                       // ← default

  return (
    <div className={`grid ${gridClass} gap-3 sm:gap-4 lg:gap-6 2xl:gap-8`}>
      {children}
    </div>
  );
};

export default StatsGrid;