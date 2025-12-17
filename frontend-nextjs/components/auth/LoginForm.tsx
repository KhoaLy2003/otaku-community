'use client'

import { Button } from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'

interface LoginFormProps {
  onSuccess?: () => void
  redirectTo?: string
}

export function LoginForm({ onSuccess, redirectTo }: LoginFormProps) {
  const { login, signup } = useAuth()

  const handleLogin = () => {
    login()
  }

  const handleSignup = () => {
    signup()
  }

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <p className="text-gray-600 text-sm">
          Sign in with your Auth0 account to access Otaku Community
        </p>
      </div>

      <Button
        onClick={handleLogin}
        className="w-full"
        size="md"
        color="orange"
      >
        Log In with Auth0
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">or</span>
        </div>
      </div>

      <Button
        onClick={handleSignup}
        className="w-full"
        size="md"
        color="grey"
      >
        Sign Up with Auth0
      </Button>

      <div className="mt-4 p-3 bg-blue-50 rounded-md border border-blue-200">
        <p className="text-xs text-blue-800 font-medium mb-1">Auth0 Authentication:</p>
        <p className="text-xs text-blue-700">
          You'll be redirected to Auth0 to securely log in or create an account.
        </p>
      </div>
    </div>
  )
}
