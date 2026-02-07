const steps = [
  {
    number: '1',
    title: 'Sign up / Log in',
    description: 'Create your account in seconds. Join thousands of otaku already building their community.',
  },
  {
    number: '2',
    title: 'Follow topics & users you like',
    description: 'Customize your experience by following your favorite creators and topics that match your interests.',
  },
  {
    number: '3',
    title: 'Interact, post, and grow your profile',
    description: 'Start sharing content, engaging with others, and building your presence in the community.',
  },
]

export function HowItWorksSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-900 to-purple-900/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Get Started in
            <span className="bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent"> 3 Simple Steps</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Join the community and start your otaku journey today
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting line for desktop */}
          {/* <div className="hidden md:block absolute top-24 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 opacity-30" /> */}

          {steps.map((step, index) => (
            <div
              key={index}
              className="relative bg-gradient-to-br from-gray-800/50 to-purple-900/30 p-8 rounded-2xl border border-purple-500/20 hover:border-purple-500/50 transition-all duration-300 hover:scale-105"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-3xl font-bold text-white mb-6 relative z-10 shadow-lg shadow-purple-500/50">
                  {step.number}
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{step.title}</h3>
                <p className="text-gray-400 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

