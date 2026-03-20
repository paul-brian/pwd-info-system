const StatsGrid = ({ children }) => (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 2xl:gap-8">
    {children}
  </div>
);

export default StatsGrid;
