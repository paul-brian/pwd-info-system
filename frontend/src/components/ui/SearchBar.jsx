// components/SearchBar.jsx
//
// Usage (search only):
// <SearchBar
//   searchValue={search}
//   setSearchValue={setSearch}
//   placeholder="Search by name..."
// />
//
// Usage (with filter dropdown):
// <SearchBar
//   searchValue={search}
//   setSearchValue={setSearch}
//   filterValue={filter}
//   setFilterValue={setFilter}
//   placeholder="Search by name..."
//   options={[
//     { value: "all",      label: "All" },
//     { value: "active",   label: "Active" },
//     { value: "inactive", label: "Inactive" },
//   ]}
// />

const SearchBar = ({
  searchValue,
  setSearchValue,
  filterValue,
  setFilterValue,
  placeholder = "Search...",
  options = [],
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-4 sm:mb-5 lg:mb-6">

      {/* Filter Dropdown */}
      {options.length > 0 && (
        <select
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
          className="border border-slate-200 dark:border-slate-700/50 rounded-xl
            px-3 sm:px-4 py-2 sm:py-2.5
            text-xs sm:text-sm 2xl:text-base
            bg-white dark:bg-slate-800 text-slate-900 dark:text-white
            focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all
            w-full sm:w-auto flex-shrink-0"
        >
          {options.map((opt, i) => (
            <option key={i} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      )}

      {/* Search Input */}
      <div className="flex w-full items-center rounded-xl
        border border-slate-200 dark:border-slate-700/50
        focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary
        bg-white dark:bg-slate-800 transition-all">

        <div className="text-slate-400 dark:text-slate-500 flex items-center justify-center pl-3 sm:pl-4">
          <span className="material-symbols-outlined text-lg sm:text-xl 2xl:text-2xl">search</span>
        </div>

        <input
          type="text"
          placeholder={placeholder}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="flex-1 border-none bg-transparent
            px-3 sm:px-4 py-2 sm:py-2.5
            placeholder:text-slate-400 dark:placeholder:text-slate-500
            text-xs sm:text-sm 2xl:text-base
            text-slate-900 dark:text-white focus:outline-none"
        />

      </div>
    </div>
  );
};

export default SearchBar;