import { useNavigate, Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'

interface SignupFormProps {
  onSuccess?: () => void
}

export function SignupForm({ onSuccess }: SignupFormProps) {
  const navigate = useNavigate()
  const { signup } = useAuth()

  const handleSignup = () => {
    signup()
    onSuccess?.()
  }

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <p className="text-gray-600 text-sm">
          Join Otaku Community using your Auth0 account
        </p>
      </div>

      <Button
        onClick={handleSignup}
        className="w-full"
        size="md"
        color="orange"
      >
        Sign Up with Auth0
      </Button>

      <div className="text-center text-sm mt-4">
        <span className="text-gray-600">Already have an account? </span>
        <Link to="/login" className="text-blue-600 hover:underline font-medium">
          Log In
        </Link>
      </div>

      <p className="text-sm text-gray-500 text-center mt-4">
        By signing up, you agree to our Terms of Service and Privacy Policy
      </p>
    </div>
  )
}