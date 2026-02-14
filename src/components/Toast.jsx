import React, { useEffect } from "react";

export default function Toast({
  message,
  type = "success",
  onClose,
  actionLabel,
  onAction,
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: "✓",
    error: "✗",
    info: "ℹ",
  };

  const colors = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-blue-500",
  };

  return (
    <div className="fixed top-24 right-4 z-50 animate-slideIn">
      <div
        className={`${colors[type]} text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 min-w-[300px]`}
      >
        <span className="text-2xl">{icons[type]}</span>
        <div className="flex-1 flex items-center justify-between gap-3">
          <span className="font-semibold">{message}</span>
          {actionLabel && onAction && (
            <button
              type="button"
              onClick={() => {
                onAction();
                onClose();
              }}
              className="ml-2 px-3 py-1 bg-white/10 hover:bg-white/20 text-sm font-semibold rounded border border-white/40 transition-colors whitespace-nowrap"
           >
              {actionLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
