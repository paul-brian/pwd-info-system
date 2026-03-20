import Modal from "./Modal";

const variantConfig = {
  success: {
    icon:       "check_circle",
    iconColor:  "text-emerald-600 dark:text-emerald-400",
    iconBg:     "bg-emerald-100 dark:bg-emerald-900/20",
    titleColor: "text-emerald-600 dark:text-emerald-400",
    noteBg:     "bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-700/30",
    noteText:   "text-emerald-900 dark:text-emerald-200",
    btnClass:   "bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 shadow-emerald-500/30",
  },
  danger: {
    icon:       "warning",
    iconColor:  "text-red-600 dark:text-red-400",
    iconBg:     "bg-red-100 dark:bg-red-900/20",
    titleColor: "text-red-600 dark:text-red-400",
    noteBg:     "bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-700/30",
    noteText:   "text-red-900 dark:text-red-200",
    btnClass:   "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-red-500/30",
  },
  warning: {
    icon:       "info",
    iconColor:  "text-amber-600 dark:text-amber-400",
    iconBg:     "bg-amber-100 dark:bg-amber-900/20",
    titleColor: "text-amber-600 dark:text-amber-400",
    noteBg:     "bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-700/30",
    noteText:   "text-amber-900 dark:text-amber-200",
    btnClass:   "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-amber-500/30",
  },
};

const ConfirmModal = ({
  title, message, subject, note,
  confirmText = "Confirm",
  variant = "success",
  onConfirm, onCancel,
}) => {
  const v = variantConfig[variant] || variantConfig.success;
  return (
    <Modal onClose={onCancel}>
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 lg:p-3 ${v.iconBg} rounded-xl flex-shrink-0`}>
          <span className={`material-symbols-outlined ${v.iconColor} text-xl lg:text-2xl`}>
            {v.icon}
          </span>
        </div>
        <h2 className={`text-lg lg:text-2xl font-bold ${v.titleColor}`}>{title}</h2>
      </div>

      <p className="text-sm lg:text-base text-slate-600 dark:text-slate-400 mb-2">
        {message}{" "}
        {subject && <strong className="text-slate-900 dark:text-white">{subject}</strong>}?
      </p>

      {note && (
        <div className={`mt-4 p-3 lg:p-4 ${v.noteBg} border rounded-xl`}>
          <p className={`text-xs lg:text-sm ${v.noteText}`}>{note}</p>
        </div>
      )}

      <div className="mt-6 flex flex-col-reverse lg:flex-row justify-end gap-2 lg:gap-3">
        <button onClick={onCancel}
          className="px-4 lg:px-6 py-2.5 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white rounded-xl font-bold hover:bg-slate-300 dark:hover:bg-slate-600 transition-all text-sm lg:text-base">
          Cancel
        </button>
        <button onClick={onConfirm}
          className={`px-4 lg:px-6 py-2.5 text-white rounded-xl font-bold transition-all shadow-lg active:scale-95 text-sm lg:text-base ${v.btnClass}`}>
          {confirmText}
        </button>
      </div>
    </Modal>
  );
};

export default ConfirmModal;