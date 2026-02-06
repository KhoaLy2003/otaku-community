import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../../lib/utils";
import { Colors } from "../../constants/colors";

export interface DropdownItem {
    label: string;
    value: string;
}

interface DropdownProps {
    items: DropdownItem[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export function Dropdown({
    items,
    value,
    onChange,
    placeholder = "Select...",
    className,
}: DropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            return () => document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [isOpen]);

    const selectedItem = items.find((item) => item.value === value);

    return (
        <div className={cn("relative min-w-[140px]", className)} ref={menuRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex w-full items-center justify-between gap-2 rounded-lg border px-4 py-2 text-left transition hover:border-gray-300 bg-white dark:bg-gray-800 shadow-sm"
                style={{
                    borderColor: isOpen ? Colors.Grey[30] : Colors.Grey[20],
                    color: selectedItem ? Colors.Grey[90] : Colors.Grey[70],
                }}
            >
                <span className="truncate text-sm font-semibold">
                    {selectedItem ? selectedItem.label : placeholder}
                </span>
                <ChevronDown
                    className={cn(
                        "h-4 w-4 transition-transform text-gray-500",
                        isOpen && "rotate-180"
                    )}
                />
            </button>

            {isOpen && (
                <div
                    className="absolute right-0 z-50 mt-1 w-full min-w-[140px] rounded-lg border bg-white dark:bg-gray-800 shadow-lg py-1 max-h-60 overflow-y-auto"
                    style={{ borderColor: Colors.Grey[20] }}
                >
                    {items.map((item) => (
                        <button
                            type="button"
                            key={item.value}
                            onClick={() => {
                                onChange(item.value);
                                setIsOpen(false);
                            }}
                            className={cn(
                                "flex w-full items-center px-4 py-2 text-sm transition-colors hover:bg-gray-50 dark:hover:bg-gray-700",
                                item.value === value
                                    ? "text-orange-600 dark:text-orange-400 font-medium bg-orange-50 dark:bg-orange-900/10"
                                    : "text-[#1a1a1b] dark:text-gray-200"
                            )}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
