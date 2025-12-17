"use client"

import { useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Tabs, type TabItem } from '@/components/ui/Tabs'
import { TextInput } from '@/components/ui/TextInput'
import { Alert } from '@/components/ui/Alert'
import { Colors } from '@/constants/colors'
import { Trash2, Plus, ChevronLeft, ChevronRight } from 'lucide-react'

const editorTabs: TabItem[] = [
  { id: 'text', label: 'Post', icon: <span>✏️</span> },
  { id: 'media', label: 'Image / Video', icon: <span>📷</span> },
]

const topics = ['Anime', 'Manga', 'Japan Travel', 'JLPT', 'Food', 'Culture']

interface UploadedFile {
  id: string
  file: File
  preview: string
  type: 'image' | 'video'
}

export default function CreatePostPage() {
  const [activeTab, setActiveTab] = useState('text')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [selectedTopic, setSelectedTopic] = useState<string | null>(topics[0])
  const [status, setStatus] = useState<'idle' | 'draft' | 'posted'>('idle')
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  const handleSubmit = (mode: 'draft' | 'post') => {
    if (!title.trim()) {
      setStatus('idle')
      return
    }
    setStatus(mode === 'draft' ? 'draft' : 'posted')
    
    // Cleanup preview URLs
    uploadedFiles.forEach(file => URL.revokeObjectURL(file.preview))
    
    // Navigate back after a delay
    if (mode === 'post') {
      setTimeout(() => {
        window.location.href = '/'
      }, 1500)
    } else {
      setTimeout(() => {
        window.location.href = '/'
      }, 1500)
    }
  }

  const hasMultipleImages = uploadedFiles.filter(f => f.type === 'image').length > 1
  const images = uploadedFiles.filter(f => f.type === 'image')

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-4 px-4 py-6">
      <Button
        variant="outline"
        color="grey"
        onClick={() => window.location.href = '/'}
        className="self-start"
        size="sm"
      >
        ← Back to Feed
      </Button>

      <div className="space-y-3">
        <h1 className="text-2xl font-bold text-[#1a1a1b]">Create Post</h1>
        <p className="text-sm text-[#7c7c7c]">Share something with your community. Title is required.</p>
      </div>

      {status !== 'idle' && (
        <Alert
          variant={status === 'draft' ? 'info' : 'success'}
          title={status === 'draft' ? 'Draft saved successfully' : 'Post published successfully'}
        >
          {status === 'draft' ? 'You can find this later in drafts.' : 'Returning to feed shortly.'}
        </Alert>
      )}

      <Card className="space-y-4 p-0" style={{ borderColor: Colors.Grey[20] }}>
        <Tabs tabs={editorTabs} activeTab={activeTab} onChange={setActiveTab} />

        <div className="space-y-4 p-4">
          <TextInput
            pill={false}
            placeholder="Title"
            value={title}
            onChange={event => setTitle(event.target.value)}
            className="w-full px-4"
            style={{ borderColor: Colors.Grey[20], backgroundColor: Colors.Grey.White }}
          />

          {activeTab === 'text' ? (
            <textarea
              placeholder="Text (optional)"
              value={content}
              onChange={event => setContent(event.target.value)}
              className="min-h-[180px] w-full rounded-lg border p-4 text-sm outline-none resize-none"
              style={{ borderColor: Colors.Grey[20], backgroundColor: Colors.Grey.White }}
            />
          ) : (
            <div className="space-y-4">
              {uploadedFiles.length === 0 ? (
                <label
                  className="flex min-h-[220px] flex-col items-center justify-center gap-2 rounded-lg border border-dashed cursor-pointer text-sm text-[#7c7c7c] hover:bg-[#F6F7F8] transition"
                  style={{ borderColor: Colors.Grey[30] }}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    className="hidden"
                    onChange={handleFileUpload}
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
                              <Image
                                src={uploadedFile.preview}
                                alt={`Preview ${index + 1}`}
                                fill
                                className="object-contain"
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

                          {/* Carousel controls for multiple images */}
                          {hasMultipleImages && isImage && (
                            <>
                              <button
                                onClick={prevImage}
                                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white shadow-md hover:bg-[#F6F7F8] opacity-0 group-hover:opacity-100 transition-opacity"
                                style={{ border: `1px solid ${Colors.Grey[20]}` }}
                              >
                                <ChevronLeft className="h-4 w-4 text-[#1a1a1b]" />
                              </button>
                              <button
                                onClick={nextImage}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white shadow-md hover:bg-[#F6F7F8] opacity-0 group-hover:opacity-100 transition-opacity"
                                style={{ border: `1px solid ${Colors.Grey[20]}` }}
                              >
                                <ChevronRight className="h-4 w-4 text-[#1a1a1b]" />
                              </button>
                              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                                {images.map((_, idx) => (
                                  <div
                                    key={idx}
                                    className={`h-2 rounded-full transition-all ${
                                      idx === currentImageIndex ? 'w-6 bg-white' : 'w-2 bg-white/50'
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
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </Card>

      <Card className="space-y-4">
        <p className="text-sm font-semibold text-[#1a1a1b]">Choose a topic</p>
        <div className="flex flex-wrap gap-2">
          {topics.map(topic => {
            const isActive = selectedTopic === topic
            return (
              <button
                key={topic}
                onClick={() => setSelectedTopic(topic)}
                className="rounded-full px-3 py-1 text-sm font-medium transition"
                style={{
                  border: `1px solid ${isActive ? Colors.Orange[30] : Colors.Grey[20]}`,
                  backgroundColor: isActive ? Colors.Orange[30] : Colors.Grey.White,
                  color: isActive ? Colors.Grey.White : Colors.Grey[70],
                }}
              >
                {topic}
              </button>
            )
          })}
        </div>
      </Card>

      <div className="flex items-center justify-end gap-2">
        <Button variant="outline" color="grey" onClick={() => handleSubmit('draft')}>
          Save Draft
        </Button>
        <Button onClick={() => handleSubmit('post')}>Post</Button>
      </div>
    </div>
  )
}

