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
    { label: "Airing", value: "Currently Airing" },
    { label: "Finished", value: "Finished Airing" },
    { label: "Upcoming", value: "Not yet aired" },
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
        <div className="flex flex-col md:flex-row gap-4 mb-8">
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

            {/* Filters */}
            <div className="flex flex-wrap gap-4 z-40">
                {yearOptions && onYearChange && (
                    <Dropdown
                        items={yearOptions}
                        value={selectedYear || ""}
                        onChange={onYearChange}
                        placeholder="All Years"
                        className="w-32"
                    />
                )}

                {seasonOptions && onSeasonChange && (
                    <Dropdown
                        items={seasonOptions}
                        value={selectedSeason || ""}
                        onChange={onSeasonChange}
                        placeholder="All Seasons"
                        className="w-40"
                    />
                )}

                <Dropdown
                    items={TYPE_OPTIONS}
                    value={selectedType}
                    onChange={onTypeChange}
                    placeholder="All Types"
                    className="w-40"
                />

                <Dropdown
                    items={STATUS_OPTIONS}
                    value={selectedStatus}
                    onChange={onStatusChange}
                    placeholder="All Status"
                    className="w-40"
                />
            </div>
        </div>
    );
};

