import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Colors } from "@/constants/colors";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
}) => {
    if (totalPages <= 1) return null;

    const handleChangePage = (page: number) => {
        document.getElementById("anime-list-top")
            ?.scrollIntoView({ behavior: "smooth" });
        onPageChange(page);
    };

    const renderPageNumbers = () => {
        const pages = [];
        // Simple logic for now: show all or simple range. 
        // For production with many pages, we'd need a more complex ellipsis logic.
        // For mock with few items, this is fine.

        // Always show first, last, current, and neighbors
        const showPages = new Set([1, totalPages, currentPage, currentPage - 1, currentPage + 1]);

        for (let i = 1; i <= totalPages; i++) {
            if (showPages.has(i) || (i > 1 && i < 5)) { // Show first few pages always for demo
                pages.push(i);
            }
        }

        // sorting and unique
        const sortedPages = Array.from(new Set(pages)).sort((a, b) => a - b);

        const result = [];
        let prev = 0;
        for (const p of sortedPages) {
            if (prev > 0 && p - prev > 1) {
                result.push(<span key={`ellipsis-${p}`} className="px-2 text-gray-500">...</span>);
            }
            result.push(
                <button
                    key={p}
                    onClick={() => handleChangePage(p)}
                    // className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium transition-colors ${currentPage === p
                    //         ? "bg-primary-600 text-white shadow-md"
                    //         : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                    //     }`}
                    className="w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium transition-colors"
                    style={
                        currentPage === p
                            ? {
                                backgroundColor: Colors.Blue[60],
                                color: Colors.Grey.White,
                                boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                            }
                            : {
                                color: Colors.Grey[70],
                            }
                    }
                    onMouseEnter={(e) => {
                        if (currentPage !== p) {
                            e.currentTarget.style.backgroundColor = Colors.Grey[10];
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (currentPage !== p) {
                            e.currentTarget.style.backgroundColor = "transparent";
                        }
                    }}
                >
                    {p}
                </button>
            );
            prev = p;
        }

        return result;
    };

    return (
        <div className="flex items-center justify-center space-x-2 mt-8">
            <button
                onClick={() => handleChangePage(currentPage - 1)}
                disabled={currentPage === 1}
                // className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                className="p-2 rounded-full transition-colors disabled:cursor-not-allowed"
                style={{
                    color:
                        currentPage === 1
                            ? Colors.Grey[50]
                            : Colors.Grey[70],
                }}
                onMouseEnter={(e) => {
                    if (currentPage !== 1) {
                        e.currentTarget.style.backgroundColor = Colors.Grey[10];
                    }
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                }}
            >
                <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-1">
                {renderPageNumbers()}
            </div>

            <button
                onClick={() => handleChangePage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
            >
                <ChevronRight className="w-5 h-5" />
            </button>
        </div>
    );
};
