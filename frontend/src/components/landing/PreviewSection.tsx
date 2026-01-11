import React from 'react'

const previews = [
  {
    title: 'Home Feed',
    description: 'Your personalized feed with posts from topics and users you follow',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    title: 'Profile Page',
    description: 'Showcase your profile, posts, and connect with other otaku',
    gradient: 'from-pink-500 to-orange-500',
  },
  {
    title: 'Post Detail',
    description: 'Engage in detailed discussions with comments and interactions',
    gradient: 'from-orange-500 to-purple-500',
  },
  {
    title: 'Notification UI',
    description: 'Stay updated with real-time notifications about your activity',
    gradient: 'from-blue-500 to-purple-500',
  },
]

export function PreviewSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-purple-900/30 to-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            See It In
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> Action</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Explore the platform features and see what awaits you
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {previews.map((preview, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl border border-purple-500/20 hover:border-purple-500/50 transition-all duration-300"
            >
              {/* Placeholder mockup */}
              <div className={`bg-gradient-to-br ${preview.gradient} p-12 min-h-[300px] flex flex-col items-center justify-center`}>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 w-full max-w-md">
                  <div className="space-y-4">
                    <div className="h-4 bg-white/20 rounded w-3/4" />
                    <div className="h-4 bg-white/20 rounded w-1/2" />
                    <div className="h-32 bg-white/10 rounded mt-4" />
                    <div className="flex gap-2 mt-4">
                      <div className="h-8 bg-white/20 rounded w-20" />
                      <div className="h-8 bg-white/20 rounded w-20" />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Overlay with title and description */}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                <div className="p-6 w-full">
                  <h3 className="text-2xl font-bold text-white mb-2">{preview.title}</h3>
                  <p className="text-gray-300">{preview.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

