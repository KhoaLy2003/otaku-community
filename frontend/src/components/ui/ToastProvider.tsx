import { Toast } from "./Toast";
import { useToast } from "../../hooks/useToast";

export function ToastProvider() {
  const { toasts, hideToast } = useToast();

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => hideToast(toast.id)}
        />
      ))}
    </div>
  );
}

export { useToast };
