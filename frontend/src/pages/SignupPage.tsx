import React from 'react'
import { Link } from 'react-router-dom'
import { SignupForm } from '@/components/auth/SignupForm'
import { Card } from '@/components/ui/Card'

const SignupPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <h1 className="text-3xl font-bold text-orange-600">Otaku Community</h1>
          </Link>
          <p className="mt-2 text-gray-600">Join our community of anime and manga enthusiasts!</p>
        </div>

        <Card variant="primary" className="p-6">
          <SignupForm />
        </Card>
      </div>
    </div>
  )
}

export default SignupPage