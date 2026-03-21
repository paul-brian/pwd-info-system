import React, { useEffect, useState } from "react";

const Toast = ({ message, type, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 10);
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const config = {
    success: {
      icon: "check_circle",
      title: "Success",
      iconBg: "bg-green-500/15",
      iconColor: "text-green-400",
      border: "border-green-500/30",
      bg: "bg-[#0d2417]",
      text: "text-green-100",
      progress: "bg-green-500",
    },
    error: {
      icon: "error",
      title: "Error",
      iconBg: "bg-red-500/15",
      iconColor: "text-red-400",
      border: "border-red-500/30",
      bg: "bg-[#2a0e0e]",
      text: "text-red-100",
      progress: "bg-red-500",
    },
    warning: {
      icon: "warning",
      title: "Warning",
      iconBg: "bg-yellow-500/15",
      iconColor: "text-yellow-400",
      border: "border-yellow-500/30",
      bg: "bg-[#2a1e08]",
      text: "text-yellow-100",
      progress: "bg-yellow-500",
    },
    info: {
      icon: "info",
      title: "Info",
      iconBg: "bg-blue-500/15",
      iconColor: "text-blue-400",
      border: "border-blue-500/30",
      bg: "bg-[#0d1a2e]",
      text: "text-blue-100",
      progress: "bg-blue-500",
    },
  };

  const c = config[type] || config.info;

  return (
    <div
      className={`
        w-full rounded-xl border overflow-hidden shadow-2xl
        transition-all duration-300 ease-out
        ${c.bg} ${c.border} ${c.text}
        ${visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full"}
      `}
    >
      {/* CONTENT */}
      <div className="flex items-start gap-3 p-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${c.iconBg}`}>
          <span className={`material-icons text-[18px] ${c.iconColor}`}>
            {c.icon}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold leading-tight">{c.title}</p>
          <p className="text-xs mt-0.5 opacity-80 leading-snug break-words">{message}</p>
        </div>
      </div>

      {/* PROGRESS BAR */}
      <div
        className={`h-[3px] ${c.progress}`}
        style={{ animation: "toast-progress 3s linear forwards" }}
      />

      <style>{`
        @keyframes toast-progress {
          from { width: 100%; }
          to   { width: 0%; }
        }
      `}</style>
    </div>
  );
};

const ToastContainer = ({ toasts, removeToast }) => (
  <div className="fixed top-4 right-4 left-4 sm:left-auto sm:right-5 sm:w-[300px] z-50 flex flex-col gap-2">
    {toasts.map((t) => (
      <Toast key={t.id} message={t.message} type={t.type} onClose={() => removeToast(t.id)} />
    ))}
  </div>
);

export { ToastContainer };