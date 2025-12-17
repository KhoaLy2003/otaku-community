import React from 'react'
import { useParams } from 'react-router-dom'

const ProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          User Profile
        </h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">
            Profile for user: {username} will be migrated here
          </p>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage