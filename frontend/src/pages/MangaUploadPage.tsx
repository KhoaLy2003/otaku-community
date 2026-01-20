import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft,
    Search,
    Upload,
    CheckCircle2,
    Loader2,
    Trash2
} from "lucide-react";
import { Dropdown } from "../components/ui/Dropdown";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";
import { ROUTES } from "../constants/routes";
import { mangaApi } from "../lib/api/manga";
import { cn } from "../lib/cn";
import { useDebounce } from "@/hooks/useDebounce";
import { TextInput } from "../components/ui/TextInput";
import { TextArea } from "../components/ui/TextArea";
import { Button } from "../components/ui/Button";
import { FileText, Info } from "lucide-react";

type UploadStep = "selection" | "details" | "upload" | "draft" | "publish";

export const MangaUploadPage = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState<UploadStep>("selection");
    const [searchQuery, setSearchQuery] = useState("");
    const debouncedSearchQuery = useDebounce(searchQuery, 300);
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [selectedManga, setSelectedManga] = useState<any | null>(null);
    const [mangaChapters, setMangaChapters] = useState<any[]>([]);
    const [selectedChapter, setSelectedChapter] = useState<string>("");
    const [translationName, setTranslationName] = useState("");
    const [notes, setNotes] = useState("");
    const [isNewChapter, setIsNewChapter] = useState(true);
    const [files, setFiles] = useState<File[]>([]);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isUploadFailed, setIsUploadFailed] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isCompressing, setIsCompressing] = useState(false);
    const [compressionProgress, setCompressionProgress] = useState(0);
    const [showFullPreview, setShowFullPreview] = useState(false);
    const [isConfirmPublishOpen, setIsConfirmPublishOpen] = useState(false);
    const [activeJobId, setActiveJobId] = useState<string | null>(null);
    const [statusPollingInterval, setStatusPollingInterval] = useState<ReturnType<typeof setInterval> | null>(null);

    const pageUrls = useMemo(
        () =>
            files.map((file) => URL.createObjectURL(file)),
        [files]
    );

    const { id } = useParams();

    useEffect(() => {
        if (id) {
            const loadManga = async () => {
                try {
                    // Try to sync/get manga by external mal_id
                    const syncedManga = await mangaApi.syncManga(id);
                    handleMangaSelect(syncedManga.data);
                } catch (error) {
                    console.error("Failed to load manga from URL", error);
                }
            };
            loadManga();
        }
    }, [id]);

    useEffect(() => {
        return () => {
            pageUrls.forEach(URL.revokeObjectURL);
        };
    }, [pageUrls]);

    const steps = [
        { id: "selection", label: "Select Manga" },
        { id: "details", label: "Translation Info" },
        { id: "upload", label: "Upload Pages" },
    ];

    useEffect(() => {
        const handleSearch = async () => {
            if (debouncedSearchQuery.length < 3) {
                setSearchResults([]);
                return;
            }

            setIsSearching(true);
            try {
                const res = await mangaApi.searchManga({ q: debouncedSearchQuery });
                setSearchResults(res.data.data);
            } catch (error) {
                console.error("Search failed", error);
            } finally {
                setIsSearching(false);
            }
        };

        handleSearch();
    }, [debouncedSearchQuery]);

    const handleMangaSelect = async (manga: any) => {
        setIsSearching(true);
        try {
            // First, sync manga to our database to get internal UUID
            const syncedManga = await mangaApi.syncManga(manga.externalId || manga.mal_id);
            setSelectedManga(syncedManga.data);

            // Then fetch chapters using our database ID
            const chapters = await mangaApi.getMangaChapters(syncedManga.data.id);
            setMangaChapters(chapters.data || []);
            setIsNewChapter(false);
        } catch (error) {
            console.error("Failed to sync manga or fetch chapters", error);
            // Fallback to what we have or allow new chapter
            setSelectedManga(manga);
            setIsNewChapter(true);
        } finally {
            setIsSearching(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setFiles((prev) => [...prev, ...newFiles]);
        }
    };

    const removeFile = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const handleDragStart = (index: number) => {
        setDraggedIndex(index);
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === index) return;

        setFiles((prev) => {
            const newFiles = [...prev];
            const draggedFile = newFiles[draggedIndex];
            newFiles.splice(draggedIndex, 1);
            newFiles.splice(index, 0, draggedFile);
            return newFiles;
        });
        setDraggedIndex(index);
    };

    /**
     * Phase 1 & 3: Optimized upload with compression and chunking
     */
    const startUpload = async () => {
        if (!selectedManga || files.length === 0) return;

        setIsUploading(true);
        setIsUploadFailed(false);
        setUploadProgress(0);

        try {
            // Phase 3: Compress images before upload
            setIsCompressing(true);
            const { compressImages } = await import("@/lib/utils/imageCompression");

            const compressedFiles = await compressImages(
                files,
                { maxWidth: 1920, maxHeight: 2880, quality: 0.85, targetSizeKB: 500 },
                (current, total) => {
                    setCompressionProgress((current / total) * 100);
                }
            );
            setIsCompressing(false);

            // Calculate size reduction
            const originalSize = files.reduce((sum, f) => sum + f.size, 0);
            const compressedSize = compressedFiles.reduce((sum, f) => sum + f.size, 0);
            const reduction = ((originalSize - compressedSize) / originalSize * 100).toFixed(1);
            console.log(`Compression: ${(originalSize / 1024 / 1024).toFixed(2)}MB → ${(compressedSize / 1024 / 1024).toFixed(2)}MB (${reduction}% reduction)`);

            // 0. Handle Chapter creation/selection
            let chapterId = selectedChapter;
            if (isNewChapter) {
                const chapter = await mangaApi.ensureChapter(selectedManga.id, Number(selectedChapter));
                chapterId = chapter.data.id;
            }

            // 1. Create Upload Job
            const job = await mangaApi.createUploadJob({
                mangaId: selectedManga.id,
                chapterId: chapterId,
                translationName: translationName || "Default Translation",
                notes: notes
            });

            setActiveJobId(job.data.uploadJobId);

            // Phase 1: Upload in chunks with progress tracking
            await mangaApi.uploadPagesInChunks(
                job.data.uploadJobId,
                compressedFiles,
                10, // Upload 10 files at a time
                (uploaded, total) => {
                    const progress = (uploaded / total) * 100;
                    setUploadProgress(progress);
                }
            );

            // 3. Redirect to dashboard
            navigate(ROUTES.MANGA_DASHBOARD);
        } catch (error) {
            console.error("Upload failed", error);
            setIsUploadFailed(true);
            setIsUploading(false);
            setIsCompressing(false);
        }
    };

    const cancelUpload = async () => {
        if (statusPollingInterval) {
            clearInterval(statusPollingInterval);
            setStatusPollingInterval(null);
        }

        if (activeJobId) {
            try {
                await mangaApi.cancelUploadJob(activeJobId);
            } catch (err) {
                console.error("Failed to cancel job", err);
            }
        }

        setIsUploading(false);
        setIsUploadFailed(false);
        setUploadProgress(0);
        setActiveJobId(null);
    };

    useEffect(() => {
        return () => {
            if (statusPollingInterval) clearInterval(statusPollingInterval);
        };
    }, [statusPollingInterval]);

    return (
        <div className="mx-auto flex flex-col gap-4">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center text-gray-400 hover:text-orange-600 mb-8 transition-colors group font-bold text-sm"
            >
                <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                Go Back
            </button>

            {/* Stepper */}
            <div className="flex items-center justify-between mb-12 px-4">
                {steps.map((step, idx) => (
                    <React.Fragment key={step.id}>
                        <div className="flex flex-col items-center gap-2">
                            <div
                                className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 border-2",
                                    currentStep === step.id
                                        ? "bg-orange-600 border-orange-600 text-white scale-110 shadow-lg shadow-orange-500/20"
                                        : steps.findIndex(s => s.id === currentStep) > idx
                                            ? "bg-orange-100 border-orange-100 text-orange-600"
                                            : "bg-white border-gray-200 text-gray-300 dark:bg-gray-800 dark:border-gray-700"
                                )}
                            >
                                {steps.findIndex(s => s.id === currentStep) > idx ? <CheckCircle2 className="w-6 h-6" /> : idx + 1}
                            </div>
                            <span className={cn(
                                "text-xs font-bold uppercase tracking-wider",
                                currentStep === step.id ? "text-orange-600" : "text-gray-400"
                            )}>
                                {step.label}
                            </span>
                        </div>
                        {idx < steps.length - 1 && (
                            <div className={cn(
                                "h-px flex-1 mx-4 transition-colors duration-300",
                                steps.findIndex(s => s.id === currentStep) > idx ? "bg-orange-500" : "bg-gray-200 dark:bg-gray-700"
                            )} />
                        )}
                    </React.Fragment>
                ))}
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl shadow-black/5 border border-gray-100 dark:border-gray-700 overflow-hidden">
                {/* Step 1: Selection */}
                {currentStep === "selection" && (
                    <div className="p-8">
                        <h2 className="text-2xl font-bold dark:text-white mb-6">Which manga are you translating?</h2>

                        {!selectedManga ? (
                            <div className="space-y-6">
                                <div className="relative group">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                                    <input
                                        type="text"
                                        placeholder="Search for manga..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border-2 border-transparent focus:border-orange-500 focus:bg-white outline-none transition-all dark:text-white"
                                    />
                                    {isSearching && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-600 animate-spin" />}
                                </div>

                                <div className="grid gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                    {searchResults.map((manga) => (
                                        <button
                                            key={manga.externalId}
                                            onClick={() => handleMangaSelect(manga)}
                                            className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-900/40 hover:bg-orange-50 dark:hover:bg-orange-500/10 border-2 border-transparent hover:border-orange-500 transition-all text-left group"
                                        >
                                            <img src={manga.imageUrl} alt={manga.title} className="w-16 h-20 object-cover rounded-lg shadow-md" />
                                            <div>
                                                <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-orange-600">{manga.title}</h3>
                                                <p className="text-xs text-gray-500">{manga.type} • {manga.status}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-8 animate-in fade-in duration-300">
                                <div className="flex items-center gap-6 p-4 bg-orange-50 dark:bg-orange-900/10 rounded-2xl border-2 border-orange-500">
                                    <img src={selectedManga.imageUrl} alt={selectedManga.title} className="w-20 h-28 object-cover rounded-xl shadow-lg" />
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold dark:text-white">{selectedManga.title}</h3>
                                        <p className="text-sm text-gray-500">{selectedManga.type}</p>
                                        <button onClick={() => setSelectedManga(null)} className="text-xs text-orange-600 font-bold mt-2 hover:underline">Change Manga</button>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider">Chapter</label>
                                        <button
                                            onClick={() => setIsNewChapter(!isNewChapter)}
                                            className="text-xs font-bold text-orange-600 hover:underline"
                                        >
                                            {isNewChapter ? "Select Existing" : "Add New Chapter"}
                                        </button>
                                    </div>

                                    {isNewChapter ? (
                                        <input
                                            type="number"
                                            value={selectedChapter}
                                            onChange={(e) => setSelectedChapter(e.target.value)}
                                            placeholder="e.g. 1"
                                            className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border-2 border-transparent focus:border-orange-500 focus:bg-white outline-none transition-all dark:text-white font-bold text-lg"
                                        />
                                    ) : (
                                        <Dropdown
                                            value={selectedChapter}
                                            onChange={setSelectedChapter}
                                            placeholder="Select a chapter"
                                            items={mangaChapters.map(ch => ({
                                                value: ch.id,
                                                label: `Chapter ${ch.chapterNumber}: ${ch.title}`
                                            }))}
                                        />
                                    )}
                                </div>

                                <button
                                    disabled={!selectedChapter}
                                    onClick={() => setCurrentStep("details")}
                                    className="w-full bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white py-4 rounded-2xl font-bold text-lg transition-all shadow-lg active:scale-[0.98]"
                                >
                                    Continue to Details
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Step 2: Details */}
                {currentStep === "details" && (
                    <div className="p-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold dark:text-white">Translation Details</h2>
                            <div className="flex items-center gap-2 text-xs font-bold text-orange-600 bg-orange-50 dark:bg-orange-900/20 px-3 py-1.5 rounded-lg border border-orange-100 dark:border-orange-900/30">
                                <Info size={14} />
                                <span>Phase 2: Metadata</span>
                            </div>
                        </div>

                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="p-4 bg-gray-50 dark:bg-gray-900/40 rounded-2xl border border-gray-100 dark:border-gray-700">
                                <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Manga & Chapter</span>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-10 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
                                        <img src={selectedManga?.imageUrl} alt="" className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm dark:text-white leading-tight">{selectedManga?.title}</p>
                                        <p className="text-xs text-orange-600 font-bold">
                                            Chapter {isNewChapter ? selectedChapter : mangaChapters.find(ch => ch.id === selectedChapter)?.chapterNumber}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <TextInput
                                label="Translation Name"
                                placeholder="e.g. Official Scanlation, Fan Translation"
                                value={translationName}
                                onChange={(e) => setTranslationName(e.target.value)}
                                pill={false}
                            />
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider ml-1 mt-[-12px]">
                                How readers will identify this translation
                            </p>

                            <TextArea
                                label="Translator Notes"
                                placeholder="Tell readers about this release, translation choices, or credits..."
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                rows={4}
                            />

                            <div className="flex gap-4">
                                <Button
                                    variant="outline"
                                    className="flex-1 py-4"
                                    onClick={() => setCurrentStep("selection")}
                                >
                                    Back
                                </Button>
                                <Button
                                    className="flex-[2] py-4"
                                    onClick={() => setCurrentStep("upload")}
                                    disabled={!translationName.trim()}
                                >
                                    Review & Upload
                                </Button>
                            </div>
                        </div>
                    </div>
                )}


                {currentStep === "upload" && (
                    <div className="p-8">
                        <h2 className="text-2xl font-bold dark:text-white mb-6">Upload manga pages</h2>

                        {!isUploading ? (
                            <div className="space-y-6">
                                <div className="border-4 border-dashed border-gray-100 dark:border-gray-700 rounded-3xl p-12 text-center hover:border-orange-500/50 transition-colors group relative cursor-pointer">
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                    <div className="bg-orange-50 dark:bg-orange-900/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                        <Upload className="w-8 h-8 text-orange-600" />
                                    </div>
                                    <h3 className="text-lg font-bold dark:text-white mb-1">Drag and drop images here</h3>
                                    <p className="text-gray-400 text-sm">Or click to browse from your computer</p>
                                </div>

                                {files.length > 0 && (
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-bold dark:text-white">{files.length} pages selected</h3>
                                            <button onClick={() => setFiles([])} className="text-xs text-red-500 font-bold hover:underline">Clear all</button>
                                        </div>
                                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 max-h-[300px] overflow-y-auto p-2">
                                            {files.map((file, idx) => (
                                                <div
                                                    key={`${file.name}-${idx}`}
                                                    draggable
                                                    onDragStart={() => handleDragStart(idx)}
                                                    onDragOver={(e) => handleDragOver(e, idx)}
                                                    onDragEnd={() => setDraggedIndex(null)}
                                                    className={cn(
                                                        "relative aspect-[2/3] group rounded-lg overflow-hidden border transition-all cursor-move",
                                                        draggedIndex === idx ? "opacity-40 scale-95 border-orange-500 shadow-inner" : "border-gray-100 dark:border-gray-700 hover:border-orange-500/50"
                                                    )}
                                                >
                                                    <img src={URL.createObjectURL(file)} alt="Preview" className="w-full h-full object-cover pointer-events-none" />
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                removeFile(idx);
                                                            }}
                                                            className="p-1.5 bg-red-600 text-white rounded-lg hover:scale-110 transition-transform"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                    <div className="absolute bottom-1 right-1 bg-black/60 text-white text-[8px] px-1 rounded uppercase font-bold">
                                                        P{idx + 1}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="flex gap-4">
                                            <button
                                                onClick={() => setCurrentStep("details")}
                                                className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-white py-4 rounded-2xl font-bold transition-all"
                                            >
                                                Back
                                            </button>
                                            <button
                                                onClick={startUpload}
                                                className="flex-[2] bg-orange-600 hover:bg-orange-700 text-white py-4 rounded-2xl font-bold text-lg transition-all shadow-lg shadow-orange-500/10 active:scale-[0.98]"
                                            >
                                                Upload to Library
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="py-20 text-center animate-in zoom-in-95 duration-500">
                                <div className="w-40 h-40 relative mx-auto mb-10">
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-100 dark:text-gray-700" />
                                        <circle
                                            cx="80" cy="80" r="70"
                                            stroke="currentColor" strokeWidth="8" fill="transparent"
                                            strokeDasharray={440}
                                            strokeDashoffset={440 - (440 * (isCompressing ? compressionProgress : uploadProgress)) / 100}
                                            className={cn(
                                                "transition-all duration-300 ease-out",
                                                isUploadFailed ? "text-red-500" : isCompressing ? "text-blue-600" : "text-orange-600"
                                            )}
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className={cn(
                                            "text-3xl font-black transition-colors",
                                            isUploadFailed ? "text-red-500" : "dark:text-white"
                                        )}>
                                            {isUploadFailed ? "!" : `${Math.round(isCompressing ? compressionProgress : uploadProgress)}%`}
                                        </span>
                                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                                            {isUploadFailed ? "Failed" : isCompressing ? "Compressing" : `${files.length} Pages`}
                                        </span>
                                    </div>
                                </div>

                                {isUploadFailed ? (
                                    <div className="space-y-4">
                                        <h3 className="text-xl font-bold dark:text-white">Something went wrong</h3>
                                        <p className="text-gray-500 max-w-xs mx-auto">There was an error while processing your images. Please try again.</p>
                                        <div className="flex gap-4 justify-center">
                                            <button
                                                onClick={cancelUpload}
                                                className="px-6 py-2 bg-gray-100 dark:bg-gray-700 font-bold rounded-xl dark:text-white"
                                            >
                                                Back
                                            </button>
                                            <button
                                                onClick={startUpload}
                                                className="px-6 py-2 bg-orange-600 font-bold rounded-xl text-white shadow-lg shadow-orange-500/20"
                                            >
                                                Retry
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-xl font-bold dark:text-white">
                                                {isCompressing ? "Optimizing images..." : "Uploading to cloud..."}
                                            </h3>
                                            <p className="text-gray-500">
                                                {isCompressing
                                                    ? "Compressing images for faster upload"
                                                    : "Uploading in optimized chunks for reliability"}
                                            </p>
                                        </div>
                                        <button
                                            onClick={cancelUpload}
                                            className="text-gray-400 font-bold hover:text-red-500 transition-colors"
                                        >
                                            Cancel Upload
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>

            <ConfirmDialog
                isOpen={isConfirmPublishOpen}
                title="Publish Translation?"
                message={`Your translation for ${selectedManga?.title} Chapter ${selectedChapter} will be visible to the community after moderation.`}
                confirmText="Yes, Publish"
                variant="warning"
                onConfirm={() => {
                    setIsConfirmPublishOpen(false);
                    alert("Published successfully!");
                    navigate(ROUTES.MANGA_DASHBOARD);
                }}
                onClose={() => setIsConfirmPublishOpen(false)}
            />
        </div>
    );
};

export default MangaUploadPage;
