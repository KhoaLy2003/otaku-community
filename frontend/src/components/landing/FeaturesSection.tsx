import React from 'react'

interface Feature {
  icon: string
  title: string
  description: string
}

const features: Feature[] = [
  {
    icon: '📝',
    title: 'Create & Share Posts',
    description: 'Express yourself with text, images, and videos. Share your thoughts, fan art, and discoveries with the community.',
  },
  {
    icon: '❤️',
    title: 'Like / Comment / Vote',
    description: 'Engage with content you love. Show appreciation, share your opinions, and participate in discussions.',
  },
  {
    icon: '🔔',
    title: 'Real-time Notifications',
    description: 'Stay connected with instant updates on likes, comments, follows, and new content from your favorite creators.',
  },
  {
    icon: '👥',
    title: 'Follow Users & Topics',
    description: 'Curate your feed by following creators and topics that interest you. Discover new content tailored to your preferences.',
  },
  {
    icon: '🖼️',
    title: 'Media-rich Content',
    description: 'Share and enjoy high-quality images and videos. Showcase your creativity and discover amazing content from others.',
  },
  {
    icon: '🧵',
    title: 'Personalized Feed',
    description: 'Get a customized feed that learns your preferences and shows you the most relevant content from your network.',
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Everything You Need to
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"> Connect & Create</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            A platform built specifically for otaku culture enthusiasts
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-purple-500/20 hover:border-purple-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20"
            >
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

