import Modal from "./Modal";

const DeleteModal = ({
  title = "Delete",
  message = "Are you sure you want to delete",
  subject,
  warning,
  confirmText = "Delete",
  onConfirm,
  onCancel,
}) => (
  <Modal onClose={onCancel}>
    <div className="flex items-center gap-3 mb-4">
      <div className="p-2 lg:p-3 bg-red-100 dark:bg-red-900/20 rounded-xl flex-shrink-0">
        <span className="material-symbols-outlined text-red-600 dark:text-red-400 text-xl lg:text-2xl">
          warning
        </span>
      </div>
      <h2 className="text-lg lg:text-2xl font-bold text-red-600 dark:text-red-400">
        {title}
      </h2>
    </div>

    <p className="text-sm lg:text-base text-slate-600 dark:text-slate-400 mb-2">
      {message}{" "}
      {subject && <strong className="text-slate-900 dark:text-white">{subject}</strong>}?
    </p>

    {warning && (
      <div className="mt-4 p-3 lg:p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-700/30 rounded-xl">
        <p className="text-xs lg:text-sm text-amber-900 dark:text-amber-200">{warning}</p>
      </div>
    )}

    <div className="mt-6 flex flex-col-reverse lg:flex-row justify-end gap-2 lg:gap-3">
      <button onClick={onCancel}
        className="px-4 lg:px-6 py-2.5 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white rounded-xl font-bold hover:bg-slate-300 dark:hover:bg-slate-600 transition-all text-sm lg:text-base">
        Cancel
      </button>
      <button onClick={onConfirm}
        className="px-4 lg:px-6 py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-red-500/30 active:scale-95 text-sm lg:text-base">
        {confirmText}
      </button>
    </div>
  </Modal>
);

export default DeleteModal;