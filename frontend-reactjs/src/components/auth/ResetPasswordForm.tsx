import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { TextInput } from '@/components/ui/TextInput'
import { z } from 'zod'

const resetPasswordSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

interface ResetPasswordFormProps {
  token: string
  onSuccess?: () => void
}

export function ResetPasswordForm({ token, onSuccess }: ResetPasswordFormProps) {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [serverError, setServerError] = useState('')
  const [tokenError, setTokenError] = useState(false)

  const handleChange = (field: 'password' | 'confirmPassword') => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
    if (serverError) setServerError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setServerError('')

    // Validate form data
    const result = resetPasswordSchema.safeParse(formData)
    if (!result.success) {
      const fieldErrors: { password?: string; confirmPassword?: string } = {}
      result.error.errors.forEach(err => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as 'password' | 'confirmPassword'] = err.message
        }
      })
      setErrors(fieldErrors)
      return
    }

    setIsSubmitting(true)
    try {
      // Mock API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Mock token validation (10% chance of expired token for demo)
      if (Math.random() < 0.1) {
        setTokenError(true)
        setServerError('This reset link has expired. Please request a new one.')
        return
      }

      onSuccess?.()
      navigate('/login?reset=success')
    } catch (error) {
      setServerError('Failed to reset password. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (tokenError) {
    return (
      <div className="space-y-4">
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-800 border border-red-200">
          <p className="font-medium mb-1">Link Expired</p>
          <p>This password reset link has expired or is invalid.</p>
        </div>

        <Button
          onClick={() => navigate('/forgot-password')}
          className="w-full"
          size="md"
          color="orange"
        >
          Request New Link
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-sm text-gray-600">
        Enter your new password below.
      </p>

      {serverError && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-800 border border-red-200">
          {serverError}
        </div>
      )}

      <div>
        <TextInput
          type="password"
          placeholder="New Password"
          value={formData.password}
          onChange={handleChange('password')}
          disabled={isSubmitting}
          pill={false}
          className="w-full"
        />
        {errors.password && (
          <p className="mt-1 text-xs text-red-600">{errors.password}</p>
        )}
      </div>

      <div>
        <TextInput
          type="password"
          placeholder="Confirm New Password"
          value={formData.confirmPassword}
          onChange={handleChange('confirmPassword')}
          disabled={isSubmitting}
          pill={false}
          className="w-full"
        />
        {errors.confirmPassword && (
          <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full"
        size="md"
        color="orange"
      >
        {isSubmitting ? 'Resetting...' : 'Reset Password'}
      </Button>
    </form>
  )
}
