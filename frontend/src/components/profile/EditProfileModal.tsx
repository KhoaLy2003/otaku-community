import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { TextInput } from '../ui/TextInput';
import { TextArea } from '../ui/TextArea';
import { Button } from '../ui/Button';
import { usersApi, type UpdateProfileData } from '../../lib/api/users';
import { animeApi } from '../../lib/api/anime';
import type { UserProfile, MainFavorite } from '../../types/user';
import type { Character } from '../../types/anime';
import { FavoriteType } from '../../types/user';
import { Badge } from '../ui/Badge';
import { X, Search } from 'lucide-react';

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: UserProfile;
    onUpdate: (updatedUser: any) => void;
}

type Tab = 'basic' | 'favorite';

export function EditProfileModal({ isOpen, onClose, user, onUpdate }: EditProfileModalProps) {
    const [activeTab, setActiveTab] = useState<Tab>('basic');
    const [formData, setFormData] = useState<UpdateProfileData>({
        username: user.username || '',
        bio: user.bio || '',
        location: user.location || '',
        interests: user.interests || [],
    });

    const [favoriteData, setFavoriteData] = useState<Partial<MainFavorite>>({
        favoriteType: FavoriteType.CHARACTER,
        favoriteId: 0,
        favoriteName: '',
        favoriteImageUrl: '',
        favoriteReason: '',
    });

    const [interestInput, setInterestInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Favorite Search State
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Character[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    // Simple debounce effect
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchQuery.length >= 3) {
                handleSearch();
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    useEffect(() => {
        if (isOpen) {
            setFormData({
                username: user.username || '',
                bio: user.bio || '',
                location: user.location || '',
                interests: user.interests || [],
            });
            if (user.mainFavorite) {
                setFavoriteData(user.mainFavorite);
            } else {
                setFavoriteData({
                    favoriteType: FavoriteType.CHARACTER,
                    favoriteId: 0,
                    favoriteName: '',
                    favoriteImageUrl: '',
                    favoriteReason: '',
                });
            }
            setErrors({});
            setSearchResults([]);
            setSearchQuery('');
            setActiveTab('basic');
        }
    }, [isOpen, user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleAddInterest = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && interestInput.trim()) {
            e.preventDefault();
            const newInterest = interestInput.trim();
            if (formData.interests && formData.interests.length >= 10) {
                setErrors(prev => ({ ...prev, interests: 'Maximum 10 interests allowed' }));
                return;
            }
            if (formData.interests?.includes(newInterest)) {
                setInterestInput('');
                return;
            }
            setFormData(prev => ({
                ...prev,
                interests: [...(prev.interests || []), newInterest]
            }));
            setInterestInput('');
        }
    };

    const removeInterest = (interest: string) => {
        setFormData(prev => ({
            ...prev,
            interests: prev.interests?.filter(i => i !== interest)
        }));
    };

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;
        setIsSearching(true);
        try {
            const response = await animeApi.searchCharacters(searchQuery);
            setSearchResults(response.data.data);
        } catch (error) {
            console.error('Failed to search characters:', error);
        } finally {
            setIsSearching(false);
        }
    };

    const selectCharacter = (char: Character) => {
        setFavoriteData(prev => ({
            ...prev,
            favoriteType: FavoriteType.CHARACTER,
            favoriteId: char.malId,
            favoriteName: char.name,
            favoriteImageUrl: char.imageUrl,
        }));
        setSearchResults([]); // clear search results after selection
        setSearchQuery('');
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.username) newErrors.username = 'Username is required';
        else if (formData.username.length < 3) newErrors.username = 'Username must be at least 3 characters';
        if (formData.bio && formData.bio.length > 500) newErrors.bio = 'Bio must be less than 500 characters';

        if (activeTab === 'favorite') {
            if (
                favoriteData.favoriteReason &&
                favoriteData.favoriteReason.length > 200
            ) {
                newErrors.favoriteReason = 'Reason must be less than 200 characters';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        setLoading(true);
        try {
            // Update Profile
            const profileResponse = await usersApi.updateProfile(formData);

            // Update Favorite if changed or set
            let favoriteResponse;
            if (favoriteData.favoriteId) {
                favoriteResponse = await usersApi.updateMainFavorite(favoriteData as MainFavorite);
            }

            if (profileResponse.success && (!favoriteData.favoriteId || favoriteResponse?.success)) {
                // Merge updates
                const u = profileResponse.data;
                if (favoriteResponse?.data) {
                    u.mainFavorite = favoriteResponse.data.mainFavorite;
                }

                onUpdate(u);
                onClose();
            } else {
                setErrors({ submit: profileResponse.message || 'Failed to update profile' });
            }
        } catch (error: any) {
            setErrors({ submit: error.message || 'An unexpected error occurred' });
        } finally {
            setLoading(false);
        }
    };

    const footer = (
        <>
            <Button variant="ghost" color="grey" onClick={onClose} disabled={loading}>
                Cancel
            </Button>
            <Button onClick={handleSubmit} isLoading={loading}>
                Save Changes
            </Button>
        </>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Edit Profile"
            footer={footer}
        >
            <div className="flex border-b border-gray-200 mb-6">
                <button
                    className={`pb-2 px-4 transition-colors font-medium ${activeTab === 'basic'
                        ? 'border-b-2 border-orange-500 text-orange-600'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                    onClick={() => setActiveTab('basic')}
                >
                    Basic Info
                </button>
                <button
                    className={`pb-2 px-4 transition-colors font-medium ${activeTab === 'favorite'
                        ? 'border-b-2 border-orange-500 text-orange-600'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                    onClick={() => setActiveTab('favorite')}
                >
                    Main Favorite
                </button>
            </div>

            <div className="min-h-[400px]">
                {errors.submit && (
                    <div className="p-3 mb-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm transition-all animate-in fade-in slide-in-from-top-1">
                        {errors.submit}
                    </div>
                )}

                {activeTab === 'basic' ? (
                    <div className="space-y-6">
                        <TextInput
                            label="Username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            error={errors.username}
                            placeholder="Enter username"
                            pill={false}
                        />

                        <TextArea
                            label="Bio"
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            error={errors.bio}
                            placeholder="Tell us about yourself..."
                            maxLength={500}
                        />

                        <TextInput
                            label="Location"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            error={errors.location}
                            placeholder="Where are you based?"
                            pill={false}
                        />

                        <div className="space-y-2">
                            <TextInput
                                label="Interests"
                                value={interestInput}
                                onChange={(e) => setInterestInput(e.target.value)}
                                onKeyDown={handleAddInterest}
                                error={errors.interests}
                                placeholder="Add an interest and press Enter"
                                pill={false}
                            />
                            <div className="flex flex-wrap gap-2 mt-2">
                                {formData.interests?.map((interest) => (
                                    <Badge
                                        key={interest}
                                        variant="filled"
                                        className="flex items-center gap-1 py-1 px-2.5"
                                    >
                                        {interest}
                                        <button
                                            type="button"
                                            onClick={() => removeInterest(interest)}
                                            className="hover:text-orange-900 transition-colors"
                                        >
                                            <X size={14} />
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                            <p className="text-sm text-gray-500">
                                {formData.interests?.length || 0}/10 interests
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Selected Favorite Preview */}
                        {favoriteData.favoriteId ? (
                            <div className="bg-orange-50 dark:bg-orange-900/10 p-4 rounded-lg border border-orange-100 dark:border-orange-800/30 flex gap-4 items-start relative">
                                <img
                                    src={favoriteData.favoriteImageUrl}
                                    alt={favoriteData.favoriteName}
                                    className="w-16 h-24 object-cover rounded shadow-sm bg-gray-200"
                                />
                                <div className="flex-1">
                                    <h4 className="font-bold text-gray-900 dark:text-gray-100">{favoriteData.favoriteName}</h4>
                                    <Badge variant="outline" className="mt-1 text-sm">{favoriteData.favoriteType}</Badge>
                                </div>
                                <button
                                    onClick={() => setFavoriteData({
                                        favoriteType: FavoriteType.CHARACTER,
                                        favoriteId: 0,
                                        favoriteName: '',
                                        favoriteImageUrl: '',
                                        favoriteReason: ''
                                    })}
                                    className="p-1 hover:bg-orange-200 dark:hover:bg-orange-800 rounded-full transition-colors"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ) : (
                            <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-lg">
                                <p className="text-gray-500">No favorite selected yet.</p>
                            </div>
                        )}

                        {/* Search Input */}
                        {!favoriteData.favoriteId && (
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 sm:text-sm transition duration-150 ease-in-out dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                                    placeholder="Search characters (e.g. Luffy)"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                {isSearching && (
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-orange-500 border-t-transparent"></div>
                                    </div>
                                )}

                                {/* Search Results Dropdown */}
                                {searchResults.length > 0 && (
                                    <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                                        {searchResults.map((char) => (
                                            <div
                                                key={char.malId}
                                                className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-orange-50 dark:hover:bg-gray-700 flex items-center gap-3 transition-colors"
                                                onClick={() => selectCharacter(char)}
                                            >
                                                <img src={char.imageUrl} alt={char.name} className="w-8 h-8 rounded-full object-cover" />
                                                <span className="font-medium block truncate text-gray-900 dark:text-gray-100">
                                                    {char.name}
                                                </span>
                                                <span className="text-sm text-gray-500">
                                                    Author of {char.favorites} favorites
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Reason Input */}
                        <TextArea
                            label="Reason (Optional)"
                            name="favoriteReason"
                            value={favoriteData.favoriteReason || ''}
                            onChange={(e) => setFavoriteData(prev => ({ ...prev, favoriteReason: e.target.value }))}
                            error={errors.favoriteReason}
                            placeholder="Why is this your favorite?"
                            maxLength={200}
                            disabled={!favoriteData.favoriteId}
                        />
                    </div>
                )}
            </div>
        </Modal>
    );
}
