import React, { useEffect } from 'react'
import { HeroSection } from '@/components/landing/HeroSection'
import { FeaturesSection } from '@/components/landing/FeaturesSection'
import { HowItWorksSection } from '@/components/landing/HowItWorksSection'
import { CommunityValueSection } from '@/components/landing/CommunityValueSection'
import { PreviewSection } from '@/components/landing/PreviewSection'
import { CTASection } from '@/components/landing/CTASection'
import { Footer } from '@/components/landing/Footer'

const LandingPage: React.FC = () => {
  useEffect(() => {
    // Enable smooth scrolling for anchor links
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const link = target.closest('a[href^="#"]')
      if (link) {
        const href = link.getAttribute('href')
        if (href && href.startsWith('#')) {
          e.preventDefault()
          const id = href.substring(1)
          const element = document.getElementById(id)
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
        }
      }
    }

    document.addEventListener('click', handleAnchorClick)
    return () => document.removeEventListener('click', handleAnchorClick)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900">
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <CommunityValueSection />
      <PreviewSection />
      <CTASection />
      <Footer />
    </div>
  )
}

export default LandingPage

