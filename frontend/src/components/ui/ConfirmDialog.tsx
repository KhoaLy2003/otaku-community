import { Modal } from './Modal';
import { Button } from './Button';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'info';
    isLoading?: boolean;
}

export function ConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'danger',
    isLoading = false,
}: ConfirmDialogProps) {
    const handleConfirm = () => {
        onConfirm();
    };

    const iconColor = variant === 'danger' ? 'text-red-600' : variant === 'warning' ? 'text-orange-600' : 'text-blue-600';

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            className="max-w-xl"
            footer={
                <>
                    <Button
                        variant="outline"
                        color="grey"
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        {cancelText}
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        disabled={isLoading}
                        style={{
                            backgroundColor: variant === 'danger' ? '#dc2626' : undefined,
                        }}
                    >
                        {isLoading ? 'Processing...' : confirmText}
                    </Button>
                </>
            }
        >
            <div className="flex gap-4">
                <div className={`flex-shrink-0 ${iconColor}`}>
                    <AlertTriangle size={24} />
                </div>
                <div className="flex-1">
                    <p className="text-base text-gray-700 leading-relaxed">
                        {message}
                    </p>
                </div>
            </div>
        </Modal>
    );
}
