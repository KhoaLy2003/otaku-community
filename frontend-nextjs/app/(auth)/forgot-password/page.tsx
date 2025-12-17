'use client'

import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm'
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm'
import { Card } from '@/components/ui/Card'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

export default function ForgotPasswordPage() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold text-orange-600">Otaku Community</h1>
          </Link>
          <p className="mt-2 text-gray-600">
            {token ? 'Reset your password' : 'Forgot your password?'}
          </p>
        </div>

        <Card variant="primary" className="p-6">
          {token ? (
            <ResetPasswordForm token={token} />
          ) : (
            <ForgotPasswordForm />
          )}
        </Card>
      </div>
    </div>
  )
}
