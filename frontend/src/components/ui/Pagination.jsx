// components/Pagination.jsx
// Usage:
// <Pagination
//   currentPage={currentPage}
//   totalPages={totalPages}
//   totalItems={filteredData.length}
//   itemsPerPage={itemsPerPage}
//   onPageChange={goToPage}
// />

const Pagination = ({ currentPage, totalPages, totalItems, itemsPerPage, onPageChange }) => {
  return (
    <>
      {/* Desktop Pagination */}
      <div className="hidden md:flex px-4 lg:px-6 py-3 lg:py-4
        bg-gradient-to-r from-slate-50 to-transparent dark:from-slate-800/30 dark:to-transparent
        border-t border-slate-200 dark:border-slate-700/50
        items-center justify-between gap-3 lg:gap-4">

        <p className="text-xs lg:text-sm 2xl:text-base text-slate-600 dark:text-slate-400 font-medium">
          Showing{" "}
          <span className="font-bold text-slate-900 dark:text-white">
            {totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}
          </span>{" "}
          to{" "}
          <span className="font-bold text-slate-900 dark:text-white">
            {Math.min(currentPage * itemsPerPage, totalItems)}
          </span>{" "}
          of{" "}
          <span className="font-bold text-slate-900 dark:text-white">{totalItems}</span>
        </p>

        <div className="flex flex-wrap gap-1 lg:gap-1.5">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="w-9 lg:w-10 2xl:w-12 h-9 lg:h-10 2xl:h-12
              flex items-center justify-center rounded-lg
              border border-slate-200 dark:border-slate-700/50
              bg-white dark:bg-slate-800
              text-slate-600 dark:text-slate-400
              hover:bg-slate-100 dark:hover:bg-slate-700
              disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Previous"
          >
            <span className="material-symbols-outlined text-lg lg:text-xl">chevron_left</span>
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => onPageChange(i + 1)}
              className={`w-9 lg:w-10 2xl:w-12 h-9 lg:h-10 2xl:h-12
                flex items-center justify-center rounded-lg border
                font-bold text-xs lg:text-sm 2xl:text-base transition-all duration-200 ${
                currentPage === i + 1
                  ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                  : "border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:border-primary/30 hover:bg-slate-50 dark:hover:bg-slate-700"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
            className="w-9 lg:w-10 2xl:w-12 h-9 lg:h-10 2xl:h-12
              flex items-center justify-center rounded-lg
              border border-slate-200 dark:border-slate-700/50
              bg-white dark:bg-slate-800
              text-slate-600 dark:text-slate-400
              hover:bg-slate-100 dark:hover:bg-slate-700
              disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Next"
          >
            <span className="material-symbols-outlined text-lg lg:text-xl">chevron_right</span>
          </button>
        </div>
      </div>

      {/* Mobile Pagination */}
      <div className="md:hidden px-3 py-3
        bg-gradient-to-r from-slate-50 to-transparent dark:from-slate-800/30 dark:to-transparent
        border-t border-slate-200 dark:border-slate-700/50">

        <p className="text-[10px] text-slate-600 dark:text-slate-400 font-medium mb-2.5 text-center">
          Page{" "}
          <span className="font-bold text-slate-900 dark:text-white">{currentPage}</span>
          {" "}of{" "}
          <span className="font-bold text-slate-900 dark:text-white">{totalPages}</span>
        </p>

        <div className="flex items-center justify-between gap-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex-1 h-10 flex items-center justify-center rounded-lg
              border border-slate-200 dark:border-slate-700/50
              bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400
              hover:bg-slate-100 dark:hover:bg-slate-700
              disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span className="material-symbols-outlined text-lg">chevron_left</span>
          </button>

          <div className="flex-1 flex items-center justify-center gap-1.5">
            {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
              const pageNum = currentPage + (i - 1);
              if (pageNum < 1 || pageNum > totalPages) return null;
              return (
                <button
                  key={pageNum}
                  onClick={() => onPageChange(pageNum)}
                  className={`w-10 h-10 flex items-center justify-center rounded-lg border
                    font-bold text-xs transition-all duration-200 ${
                    currentPage === pageNum
                      ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                      : "border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
            className="flex-1 h-10 flex items-center justify-center rounded-lg
              border border-slate-200 dark:border-slate-700/50
              bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400
              hover:bg-slate-100 dark:hover:bg-slate-700
              disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span className="material-symbols-outlined text-lg">chevron_right</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Pagination;