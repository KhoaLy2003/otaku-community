import React from "react";
import { Search } from "lucide-react";
import { TextInput } from "../ui/TextInput";
import { Dropdown } from "../ui/Dropdown";

interface FilterBarProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    selectedType: string;
    onTypeChange: (type: string) => void;
    selectedStatus: string;
    onStatusChange: (status: string) => void;
    selectedYear?: string;
    onYearChange?: (year: string) => void;
    selectedSeason?: string;
    onSeasonChange?: (season: string) => void;
    yearOptions?: { label: string; value: string }[];
    seasonOptions?: { label: string; value: string }[];
}


const TYPE_OPTIONS = [
    { label: "All Types", value: "" },
    { label: "TV", value: "TV" },
    { label: "Movie", value: "Movie" },
    { label: "OVA", value: "OVA" },
    { label: "Special", value: "Special" },
];

const STATUS_OPTIONS = [
    { label: "All Status", value: "" },
    { label: "Airing", value: "airing" },
    { label: "Completed", value: "complete" },
    { label: "Upcoming", value: "upcoming" },
];

export const FilterBar: React.FC<FilterBarProps> = ({
    searchQuery,
    onSearchChange,
    selectedType,
    onTypeChange,
    selectedStatus,
    onStatusChange,
    selectedYear,
    onYearChange,
    selectedSeason,
    onSeasonChange,
    yearOptions,
    seasonOptions,
}) => {
    return (
        <div className="flex flex-col gap-4 mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
                {/* Search Input */}
                <div className="relative flex-1">
                    <TextInput
                        placeholder="Search anime..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        onClear={() => onSearchChange("")}
                        leadingIcon={<Search className="w-5 h-5 text-gray-400" />}
                        pill={true}
                        className="bg-white dark:bg-gray-800"
                    />
                </div>

                {/* Filters Row 1 */}
                <div className="flex flex-1 gap-2 sm:gap-4 overflow-x-auto pb-2 sm:pb-0 z-40 no-scrollbar">
                    {yearOptions && onYearChange && (
                        <Dropdown
                            items={yearOptions}
                            value={selectedYear || ""}
                            onChange={onYearChange}
                            placeholder="Years"
                            className="flex-1 min-w-[120px] sm:w-32"
                        />
                    )}

                    {seasonOptions && onSeasonChange && (
                        <Dropdown
                            items={seasonOptions}
                            value={selectedSeason || ""}
                            onChange={onSeasonChange}
                            placeholder="Seasons"
                            className="flex-1 min-w-[120px] sm:w-40"
                        />
                    )}

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

