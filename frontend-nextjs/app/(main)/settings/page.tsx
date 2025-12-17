'use client'

import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

export default function SettingsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>

      <Card className="p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Settings</h2>
        <p className="text-gray-600 mb-4">
          Manage your account preferences and settings.
        </p>
        <Button color="blue" size="sm">
          Edit Account
        </Button>
      </Card>

      <Card className="p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Privacy Settings</h2>
        <p className="text-gray-600 mb-4">
          Control who can see your content and profile.
        </p>
        <Button color="blue" size="sm">
          Manage Privacy
        </Button>
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h2>
        <p className="text-gray-600 mb-4">
          Choose what notifications you want to receive.
        </p>
        <Button color="blue" size="sm">
          Configure Notifications
        </Button>
      </Card>
    </div>
  )
}
