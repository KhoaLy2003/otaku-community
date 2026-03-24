import React from "react";
import { Search } from "lucide-react";
import { TextInput } from "../ui/TextInput";
import { Dropdown } from "../ui/Dropdown";

interface MangaFilterBarProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    selectedType: string;
    onTypeChange: (type: string) => void;
    selectedStatus: string;
    onStatusChange: (status: string) => void;
}

const TYPE_OPTIONS = [
    { label: "All Types", value: "" },
    { label: "Manga", value: "manga" },
    { label: "Novel", value: "novel" },
    { label: "Light Novel", value: "lightnovel" },
    { label: "One-shot", value: "oneshot" },
    { label: "Doujin", value: "doujin" },
    { label: "Manhwa", value: "manhwa" },
    { label: "Manhua", value: "manhua" },
];

const STATUS_OPTIONS = [
    { label: "All Status", value: "" },
    { label: "Publishing", value: "publishing" },
    { label: "Finished", value: "complete" },
    { label: "On Hiatus", value: "hiatus" },
    { label: "Discontinued", value: "discontinued" },
    { label: "Upcoming", value: "upcoming" },
];

export const MangaFilterBar: React.FC<MangaFilterBarProps> = ({
    searchQuery,
    onSearchChange,
    selectedType,
    onTypeChange,
    selectedStatus,
    onStatusChange,
}) => {
    return (
        <div className="flex flex-col gap-4 mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
                {/* Search Input */}
                <div className="relative flex-1">
                    <TextInput
                        placeholder="Search manga..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        onClear={() => onSearchChange("")}
                        leadingIcon={<Search className="w-5 h-5 text-gray-400" />}
                        pill={true}
                        className="bg-white dark:bg-gray-800"
                    />
                </div>

                {/* Filters Row */}
                <div className="flex flex-1 gap-2 sm:gap-4 overflow-x-auto pb-2 sm:pb-0 z-40 no-scrollbar">
                    <Dropdown
                        items={TYPE_OPTIONS}
                        value={selectedType}
                        onChange={onTypeChange}
                        placeholder="Types"
                        className="flex-1 min-w-[120px] sm:w-40"
                    />

                    <Dropdown
                        items={STATUS_OPTIONS}
                        value={selectedStatus}
                        onChange={onStatusChange}
                        placeholder="Status"
                        className="flex-1 min-w-[120px] sm:w-40"
                    />
                </div>
            </div>
        </div>
    );
};
