// components/Modal.jsx
// Base modal wrapper
//
// Mobile + Tablet (below lg: / 1024px) → bottom sheet
// Laptop+ (1024px+)                    → centered
//
// Usage:
// <Modal onClose={closeModal}>
//   <p>Your content here</p>
// </Modal>
//
// Wide modal:
// <Modal onClose={closeModal} wide>
//   <p>Your content here</p>
// </Modal>

const Modal = ({ children, onClose, wide = false }) => (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-end lg:items-center justify-center z-50 p-0 lg:p-4">
    <div className={`bg-white dark:bg-slate-900 rounded-t-3xl lg:rounded-2xl p-4 sm:p-6 lg:p-7
      w-full ${wide ? "lg:w-[680px]" : "lg:w-[520px]"} lg:max-w-[95%]
      border border-slate-200 dark:border-slate-700/50 shadow-2xl
      max-h-[85vh] lg:max-h-[90vh] overflow-y-auto`}>
      {children}
    </div>
  </div>
);

export default Modal;