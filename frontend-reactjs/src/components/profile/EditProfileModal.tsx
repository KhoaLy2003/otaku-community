import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { TextInput } from '../ui/TextInput';
import { TextArea } from '../ui/TextArea';
import { Button } from '../ui/Button';
import { usersApi, type UpdateProfileData } from '../../lib/api/users';
import type { UserProfile } from '../../types/user';
import { Badge } from '../ui/Badge';
import { X } from 'lucide-react';

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: UserProfile;
    onUpdate: (updatedUser: any) => void;
}

export function EditProfileModal({ isOpen, onClose, user, onUpdate }: EditProfileModalProps) {
    const [formData, setFormData] = useState<UpdateProfileData>({
        username: user.username || '',
        bio: user.bio || '',
        location: user.location || '',
        interests: user.interests || [],
    });

    const [interestInput, setInterestInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (isOpen) {
            setFormData({
                username: user.username || '',
                bio: user.bio || '',
                location: user.location || '',
                interests: user.interests || [],
            });
            setErrors({});
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
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.interests;
                return newErrors;
            });
        }
    };

    const removeInterest = (interest: string) => {
        setFormData(prev => ({
            ...prev,
            interests: prev.interests?.filter(i => i !== interest)
        }));
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.username) newErrors.username = 'Username is required';
        else if (formData.username.length < 3) newErrors.username = 'Username must be at least 3 characters';

        if (formData.bio && formData.bio.length > 500) newErrors.bio = 'Bio must be less than 500 characters';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        setLoading(true);
        try {
            const response = await usersApi.updateProfile(formData);
            if (response.success) {
                onUpdate(response.data);
                onClose();
            } else {
                setErrors({ submit: response.message || 'Failed to update profile' });
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
            <div className="space-y-6">
                {errors.submit && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm transition-all animate-in fade-in slide-in-from-top-1">
                        {errors.submit}
                    </div>
                )}

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
                    {formData.interests && formData.interests.length > 0 && (
                        <p className="text-xs text-gray-500 mt-1">
                            {formData.interests.length}/10 interests
                        </p>
                    )}
                </div>
            </div>
        </Modal>
    );
}
