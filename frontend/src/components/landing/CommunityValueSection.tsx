const values = [
  {
    title: 'Built for Otaku',
    description: 'Not generic social media. We understand otaku culture and built this platform specifically for anime, manga, and Japanese culture enthusiasts.',
  },
  {
    title: 'Topic-based Discussions',
    description: 'Organize conversations around topics you care about. Find your niche and connect with like-minded fans.',
  },
  {
    title: 'Clean Feed Algorithm',
    description: 'No noise, just content that matters. Our algorithm prioritizes quality and relevance over engagement metrics.',
  },
  {
    title: 'Safe & Moderated Environment',
    description: 'We maintain a welcoming community with active moderation. Share freely knowing you\'re in a safe space.',
  },
]

export function CommunityValueSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Why This Platform is
            <span className="bg-gradient-to-r from-pink-400 to-orange-400 bg-clip-text text-transparent"> Different</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            A community platform designed with otaku culture in mind
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {values.map((value, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-pink-500/20 hover:border-pink-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-pink-500/20"
            >
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
                <span className="w-2 h-2 rounded-full bg-gradient-to-r from-pink-400 to-orange-400 mr-3" />
                {value.title}
              </h3>
              <p className="text-gray-400 leading-relaxed">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

