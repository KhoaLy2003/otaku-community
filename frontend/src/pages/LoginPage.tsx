import React from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { LoginForm } from '@/components/auth/LoginForm'
import { Card } from '@/components/ui/Card'

const LoginPage: React.FC = () => {
  const [searchParams] = useSearchParams()
  const resetSuccess = searchParams.get('reset') === 'success'

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <h1 className="text-3xl font-bold text-orange-600">Otaku Community</h1>
          </Link>
          <p className="mt-2 text-gray-600">Welcome back! Please login to your account.</p>
        </div>

        {resetSuccess && (
          <div className="mb-4 rounded-md bg-green-50 p-4 text-sm text-green-800 border border-green-200">
            <p className="font-medium">Password reset successful!</p>
            <p>You can now log in with your new password.</p>
          </div>
        )}

        <Card variant="primary" className="p-6">
          <LoginForm />
        </Card>
      </div>
    </div>
  )
}

export default LoginPage