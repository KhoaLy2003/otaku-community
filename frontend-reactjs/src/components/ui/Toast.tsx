import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

export type ToastType = "success" | "error" | "info";

export interface ToastProps {
  id: number;
  message: string;
  type: ToastType;
  onClose: () => void;
}

const toastStyles = {
  success: "bg-green-500",
  error: "bg-red-500",
  info: "bg-blue-500",
};

export function Toast({ id, message, type, onClose }: ToastProps) {
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsFadingOut(true);
    setTimeout(onClose, 300); // Wait for fade out animation to complete
  };

  return (
    <div
      className={`relative flex items-center justify-between gap-4 rounded-md p-4 text-white shadow-lg transition-all duration-300 ${
        toastStyles[type]
      } ${isFadingOut ? "opacity-0 scale-90" : "opacity-100 scale-100"}`}
    >
      <span>{message}</span>
      <button onClick={handleClose}>
        <X className="h-5 w-5" />
      </button>
    </div>
  );
}
