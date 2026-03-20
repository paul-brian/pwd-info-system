import Modal from "./Modal";

const AddEditModal = ({
  isOpen,
  isEdit = false,
  title,
  icon = "edit_note",
  onCancel,
  children,
}) => {
  if (!isOpen) return null;
  return (
    <Modal onClose={onCancel}>
      <div className="flex items-center gap-2 mb-3 lg:mb-4">
        <span className="material-symbols-outlined text-primary text-xl lg:text-2xl">
          {icon}
        </span>
        <h2 className="text-lg lg:text-2xl font-bold text-slate-900 dark:text-white">
          {isEdit ? `Edit ${title}` : `Add New ${title}`}
        </h2>
      </div>
      {children}
    </Modal>
  );
};

export default AddEditModal;