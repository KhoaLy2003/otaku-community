import React from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import { Button } from '@/components/ui/Button'

export function CTASection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
          Ready to Start Your
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent"> Otaku Journey?</span>
        </h2>
        <p className="text-xl sm:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto">
          Join thousands of otaku who are already sharing, creating, and connecting in our community.
        </p>
        <Link to={ROUTES.REGISTER}>
          <Button
            size="md"
            color="orange"
            variant="filled"
            className="text-xl px-12 py-6 hover:scale-110 transition-transform shadow-2xl shadow-orange-500/50"
          >
            Start Your Otaku Journey
          </Button>
        </Link>
      </div>
    </section>
  )
}

