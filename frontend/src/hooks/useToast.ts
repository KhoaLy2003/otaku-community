import { create } from "zustand";

interface Toast {
  id: number;
  message: string;
  type: "success" | "error" | "info";
}

interface ToastState {
  toasts: Toast[];
  showToast: (message: string, type: "success" | "error" | "info") => void;
  hideToast: (id: number) => void;
}

export const useToast = create<ToastState>((set) => ({
  toasts: [],
  showToast: (message, type) => {
    const newToast = { id: Date.now(), message, type };
    set((state) => ({ toasts: [...state.toasts, newToast] }));
  },
  hideToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },
}));
