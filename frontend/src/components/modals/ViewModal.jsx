import Modal from "./Modal";

const ViewModal = ({
  title,
  icon = "visibility",
  data,
  onClose,
  children,
}) => (
  <Modal onClose={onClose}>
    <h2 className="text-xl lg:text-2xl font-bold mb-4 lg:mb-6 text-slate-900 dark:text-white flex items-center gap-2">
      <span className="material-symbols-outlined text-primary text-2xl">{icon}</span>
      {title}
    </h2>

    {data && (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4 mb-4 lg:mb-6
        bg-slate-50 dark:bg-slate-800/30 p-3 lg:p-4 rounded-xl
        border border-slate-100 dark:border-slate-700">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="flex flex-col">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
              {key.replace(/_/g, " ")}:
            </span>
            <span className="text-xs lg:text-sm font-medium text-slate-900 dark:text-slate-100 break-words">
              {value ?? "—"}
            </span>
          </div>
        ))}
      </div>
    )}

    {children}

    <button onClick={onClose}
      className="w-full px-4 py-2.5 bg-gradient-to-r from-primary to-primary/90 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-primary/30 transition-all active:scale-95 text-sm lg:text-base">
      Close
    </button>
  </Modal>
);

export default ViewModal;