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
      <div className="md:hidden px-3 py-3 border-t
  border-slate-200 dark:border-slate-700/50
  bg-white/80 dark:bg-slate-900/80 backdrop-blur">

        {/* Page Info */}
        <div className="text-center mb-3">
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Page
            <span className="mx-1 font-bold text-slate-900 dark:text-white">
              {currentPage}
            </span>
            of
            <span className="ml-1 font-bold text-slate-900 dark:text-white">
              {totalPages}
            </span>
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between gap-2">

          {/* PREV */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="h-11 px-4 flex items-center justify-center
        rounded-xl border
        border-slate-200 dark:border-slate-700
        bg-white dark:bg-slate-800
        active:scale-95 transition
        disabled:opacity-40"
          >
            <span className="material-symbols-outlined text-xl">
              chevron_left
            </span>
          </button>

          {/* PAGE PILLS */}
          <div className="flex items-center gap-2">

            {Array.from({ length: 3 }, (_, i) => {
              const page = currentPage - 1 + i;

              if (page < 1 || page > totalPages) return null;

              return (
                <button
                  key={page}
                  onClick={() => onPageChange(page)}
                  className={`min-w-[42px] h-11 px-3
              rounded-xl font-semibold text-sm
              transition-all duration-200
              ${currentPage === page
                      ? "bg-primary text-white shadow-lg shadow-primary/25 scale-105"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 active:scale-95"
                    }`}
                >
                  {page}
                </button>
              );
            })}
          </div>

          {/* NEXT */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
            className="h-11 px-4 flex items-center justify-center
        rounded-xl border
        border-slate-200 dark:border-slate-700
        bg-white dark:bg-slate-800
        active:scale-95 transition
        disabled:opacity-40"
          >
            <span className="material-symbols-outlined text-xl">
              chevron_right
            </span>
          </button>

        </div>
      </div>
    </>
  );
};

export default Pagination;