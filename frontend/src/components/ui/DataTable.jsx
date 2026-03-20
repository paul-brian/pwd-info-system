// // components/DataTable.jsx
// // Usage:
// // <DataTable
// //   columns={["Name", "Status", "Actions"]}       ← desktop table headers
// //   data={paginatedData}                           ← paginated data array
// //   renderRow={(item) => <tr>...</tr>}             ← desktop table row
// //   renderCard={(item) => <div>...</div>}          ← mobile card
// //   pagination={<Pagination ... />}               ← optional pagination
// //   empty="No records found."                     ← optional empty message
// // />

const DataTable = ({ columns, data, renderRow, renderCard, pagination, empty = "No records found." }) => {
  return (
    <>
      {/* ── Desktop: Table (lg+) ── */}
      <div className="hidden lg:block bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700/50 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full table-fixed text-left border-collapse">
            <thead className="bg-gradient-to-r from-slate-50 to-transparent dark:from-slate-800/50 dark:to-transparent border-b border-slate-200 dark:border-slate-700/50">
              <tr>
                {columns.map((col) => (
                  <th key={col} className="px-3 lg:px-4 xl:px-5 py-2.5 lg:py-3 xl:py-4
                    text-[10px] xl:text-xs
                    font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-12 text-center text-sm text-slate-500 dark:text-slate-400">
                    {empty}
                  </td>
                </tr>
              ) : (
                data.map((item, i) => renderRow(item, i))
              )}
            </tbody>
          </table>
        </div>
        {pagination}
      </div>

      {/* ── Mobile + Tablet: Cards (below lg) ── */}
      <div className="lg:hidden flex flex-col gap-2.5">
        {data.length === 0 ? (
          <div className="text-center py-10 text-sm text-slate-500 dark:text-slate-400">
            {empty}
          </div>
        ) : (
          data.map((item, i) => renderCard(item, i))
        )}
        {pagination}
      </div>
    </>
  );
};

export default DataTable;