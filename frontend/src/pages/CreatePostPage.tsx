import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { TextInput } from '@/components/ui/TextInput'
import { Alert } from '@/components/ui/Alert'
import { Colors } from '@/constants/colors'
import { Trash2, Plus, ChevronLeft, ChevronRight, Link as LinkIcon } from 'lucide-react'
import { postsApi } from '@/lib/api/posts'
import { topicsApi } from '@/lib/api/topics'
import AnimeMangaSearch from '@/components/posts/AnimeMangaSearch'
import type { PostStatus, PostReferenceRequest } from '@/types/post'
import type { Topic } from '@/types/topic'

interface UploadedFile {
  id: string
  file: File
  preview: string
  type: 'image' | 'video'
}

const CreatePostPage: React.FC = () => {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [topics, setTopics] = useState<Topic[]>([])
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null)
  const [selectedReferences, setSelectedReferences] = useState<PostReferenceRequest[]>([])
  const [status, setStatus] = useState<'idle' | 'draft' | 'posted' | 'error'>('idle')
  const [loading, setLoading] = useState(false)
  const [loadingTopics, setLoadingTopics] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await topicsApi.getTopics()
        setTopics(response.data)
        if (response.data.length > 0) {
          setSelectedTopic(response.data[0].id)
        }
      } catch (error) {
        console.error('Failed to fetch topics', error)
      } finally {
        setLoadingTopics(false)
      }
    }
    fetchTopics()
  }, [])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    Array.from(files).forEach((file) => {
      const isImage = file.type.startsWith('image/')
      const isVideo = file.type.startsWith('video/')

      if (isImage || isVideo) {
        const id = Date.now().toString() + Math.random().toString(36).substr(2, 9)
        const preview = URL.createObjectURL(file)

        setUploadedFiles((prev) => [
          ...prev,
          { id, file, preview, type: isImage ? 'image' : 'video' }
        ])
      }
    })

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleRemoveFile = (id: string) => {
    setUploadedFiles((prev) => {
      const fileToRemove = prev.find(f => f.id === id)
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.preview)
      }
      return prev.filter(f => f.id !== id)
    })
    if (currentImageIndex >= uploadedFiles.length - 1) {
      setCurrentImageIndex(Math.max(0, uploadedFiles.length - 2))
    }
  }

  const handleAddMoreFiles = () => {
    fileInputRef.current?.click()
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev < uploadedFiles.length - 1 ? prev + 1 : 0
    )
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev > 0 ? prev - 1 : uploadedFiles.length - 1
    )
  }

  const handleSelectReference = (ref: PostReferenceRequest) => {
    setSelectedReferences(prev => [...prev, ref]);
  };

  const handleRemoveReference = (externalId: number) => {
    setSelectedReferences(prev => prev.filter(r => r.externalId !== externalId));
  };

  const handleSubmit = async (mode: 'draft' | 'post') => {
    if (!title.trim() || !selectedTopic) {
      setErrorMessage('Title and a selected topic are required.')
      setStatus('error')
      return
    }
    setLoading(true)
    setStatus('idle')
    setErrorMessage(null)

    const postStatus: PostStatus = mode === 'draft' ? 'DRAFT' : 'PUBLISHED'
    const files = uploadedFiles.map(f => f.file)

    try {
      await postsApi.createPost({
        title,
        content,
        status: postStatus,
        topicIds: [selectedTopic],
        files,
        references: selectedReferences,
      })

      setStatus(mode === 'draft' ? 'draft' : 'posted')

      // Cleanup preview URLs
      uploadedFiles.forEach(file => URL.revokeObjectURL(file.preview))

      // Navigate back after a delay
      setTimeout(() => {
        navigate('/')
      }, 1500)
    } catch (error: any) {
      setStatus('error')
      setErrorMessage(error.message || 'An unexpected error occurred.')
    } finally {
      setLoading(false)
    }
  }

  const hasMultipleImages = uploadedFiles.filter(f => f.type === 'image').length > 1
  const images = uploadedFiles.filter(f => f.type === 'image')

  return (
    <div className="mx-auto flex flex-col gap-4">
      <Button
        variant="outline"
        color="grey"
        onClick={() => navigate('/')}
        className="self-start"
        size="sm"
        disabled={loading}
      >
        ← Back to Feed
      </Button>

      <div className="space-y-3">
        <h1 className="text-2xl font-bold text-[#1a1a1b]">Create Post</h1>
        <p className="text-sm text-[#7c7c7c]">Share something with your community. Title is required.</p>
      </div>

      {status === 'error' && errorMessage && (
        <Alert variant="error" title="Error">
          {errorMessage}
        </Alert>
      )}

      {status !== 'idle' && status !== 'error' && (
        <Alert
          variant={status === 'draft' ? 'info' : 'success'}
          title={status === 'draft' ? 'Draft saved successfully' : 'Post published successfully'}
        >
          {status === 'draft' ? 'You can find this later in drafts.' : 'Returning to feed shortly.'}
        </Alert>
      )}

      <div className="space-y-6">
        {/* Post Content Section */}
        <Card className="space-y-4 p-4" style={{ borderColor: Colors.Grey[20] }}>
          <div className="flex items-center gap-2 border-b pb-2" style={{ borderColor: Colors.Grey[10] }}>
            <span className="text-lg">✏️</span>
            <h2 className="font-bold text-[#1a1a1b]">Post Content</h2>
          </div>
          <TextInput
            pill={false}
            placeholder="Title"
            value={title}
            onChange={event => setTitle(event.target.value)}
            className="w-full px-4"
            style={{ borderColor: Colors.Grey[20], backgroundColor: Colors.Grey.White }}
            disabled={loading}
          />
          <textarea
            placeholder="Text (optional)"
            value={content}
            onChange={event => setContent(event.target.value)}
            className="min-h-[180px] w-full rounded-lg border p-4 text-sm outline-none resize-none"
            style={{ borderColor: Colors.Grey[20], backgroundColor: Colors.Grey.White }}
            disabled={loading}
          />
        </Card>

        {/* Media Section */}
        <Card className="space-y-4 p-4" style={{ borderColor: Colors.Grey[20] }}>
          <div className="flex items-center gap-2 border-b pb-2" style={{ borderColor: Colors.Grey[10] }}>
            <span className="text-lg">📷</span>
            <h2 className="font-bold text-[#1a1a1b]">Image / Video</h2>
          </div>
          <div className="space-y-4">
            {uploadedFiles.length === 0 ? (
              <label
                className={`flex min-h-[200px] flex-col items-center justify-center gap-2 rounded-lg border border-dashed text-sm text-[#7c7c7c] ${loading ? 'cursor-not-allowed bg-gray-100' : 'cursor-pointer hover:bg-[#F6F7F8]'
                  } transition`}
                style={{ borderColor: Colors.Grey[30] }}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  className="hidden"
                  onChange={handleFileUpload}
                  disabled={loading}
                />
                <Plus className="h-8 w-8" />
                Drop media here or click to upload
              </label>
            ) : (
              <div className="space-y-3">
                {uploadedFiles.map((uploadedFile, index) => {
                  const isImage = uploadedFile.type === 'image'
                  const isCurrentImage = isImage && images.indexOf(uploadedFile) === currentImageIndex
                  const shouldShow = isImage ? isCurrentImage : true

                  if (!shouldShow && isImage) return null

                  return (
                    <div key={uploadedFile.id} className="relative group">
                      <div className="relative rounded-lg overflow-hidden border" style={{ borderColor: Colors.Grey[20] }}>
                        {isImage ? (
                          <div className="relative w-full h-[400px] bg-[#F6F7F8]">
                            <img
                              src={uploadedFile.preview}
                              alt={`Preview ${index + 1}`}
                              className="object-contain w-full h-full"
                            />
                          </div>
                        ) : (
                          <div className="relative w-full h-[400px] bg-[#F6F7F8]">
                            <video
                              src={uploadedFile.preview}
                              controls
                              className="w-full h-full object-contain"
                            />
                          </div>
                        )}

                        {/* Action buttons overlay */}
                        {!loading && (
                          <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={handleAddMoreFiles}
                              className="p-2 rounded-full bg-white shadow-md hover:bg-[#F6F7F8]"
                              style={{ border: `1px solid ${Colors.Grey[20]}` }}
                              title="Add more files"
                            >
                              <Plus className="h-4 w-4 text-[#1a1a1b]" />
                            </button>
                            <button
                              onClick={() => handleRemoveFile(uploadedFile.id)}
                              className="p-2 rounded-full bg-white shadow-md hover:bg-red-50"
                              style={{ border: `1px solid ${Colors.Grey[20]}` }}
                              title="Remove file"
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </button>
                          </div>
                        )}

                        {/* Carousel controls for multiple images */}
                        {hasMultipleImages && isImage && (
                          <>
                            <button
                              onClick={prevImage}
                              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white shadow-md hover:bg-[#F6F7F8] opacity-0 group-hover:opacity-100 transition-opacity"
                              style={{ border: `1px solid ${Colors.Grey[20]}` }}
                              disabled={loading}
                            >
                              <ChevronLeft className="h-4 w-4 text-[#1a1a1b]" />
                            </button>
                            <button
                              onClick={nextImage}
                              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white shadow-md hover:bg-[#F6F7F8] opacity-0 group-hover:opacity-100 transition-opacity"
                              style={{ border: `1px solid ${Colors.Grey[20]}` }}
                              disabled={loading}
                            >
                              <ChevronRight className="h-4 w-4 text-[#1a1a1b]" />
                            </button>
                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                              {images.map((_, idx) => (
                                <div
                                  key={idx}
                                  className={`h-2 rounded-full transition-all ${idx === currentImageIndex ? 'w-6 bg-white' : 'w-2 bg-white/50'
                                    }`}
                                />
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  )
                })}

                {/* Hidden file input for adding more files */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  className="hidden"
                  onChange={handleFileUpload}
                  disabled={loading}
                />

                {uploadedFiles.length > 0 && (
                  <Button
                    variant="outline"
                    color="grey"
                    size="sm"
                    className="w-full border-dashed"
                    onClick={handleAddMoreFiles}
                    disabled={loading}
                  >
                    <Plus className="mr-2 h-4 w-4" /> Add more media
                  </Button>
                )}
              </div>
            )}
          </div>
        </Card>

        {/* Linkage Section */}
        <Card className="space-y-4 p-4" style={{ borderColor: Colors.Grey[20] }}>
          <div className="flex items-center gap-2 border-b pb-2" style={{ borderColor: Colors.Grey[10] }}>
            <LinkIcon className="h-4 w-4" />
            <h2 className="font-bold text-[#1a1a1b]">Link Anime/Manga</h2>
          </div>
          <div className="space-y-4">
            <p className="text-sm text-[#7c7c7c]">Link an Anime or Manga to this post.</p>
            <AnimeMangaSearch
              onSelect={handleSelectReference}
              selectedReferences={selectedReferences}
              onRemove={handleRemoveReference}
            />
          </div>
        </Card>
      </div>

      <Card className="space-y-4">
        <p className="text-sm font-semibold text-[#1a1a1b]">Choose a topic</p>
        {loadingTopics ? (
          <p>Loading topics...</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {topics.map(topic => {
              const isActive = selectedTopic === topic.id
              return (
                <button
                  key={topic.id}
                  onClick={() => setSelectedTopic(topic.id)}
                  className="rounded-full px-3 py-1 text-sm font-medium transition"
                  style={{
                    border: `1px solid ${isActive ? Colors.Orange[30] : Colors.Grey[20]}`,
                    backgroundColor: isActive ? Colors.Orange[30] : Colors.Grey.White,
                    color: isActive ? Colors.Grey.White : Colors.Grey[70],
                  }}
                  disabled={loading}
                >
                  {topic.name}
                </button>
              )
            })}
          </div>
        )}
      </Card>

      <div className="flex items-center justify-end gap-2">
        {/* <Button
          variant="outline"
          color="grey"
          onClick={() => handleSubmit('draft')}
          disabled={loading || loadingTopics}
        >
          {loading ? 'Saving...' : 'Save Draft'}
        </Button> */}
        <Button onClick={() => handleSubmit('post')} disabled={loading || loadingTopics} style={{ backgroundColor: Colors.Orange[30] }}>
          {loading ? 'Posting...' : 'Post'}
        </Button>
      </div>
    </div>
  )
}

export default CreatePostPage