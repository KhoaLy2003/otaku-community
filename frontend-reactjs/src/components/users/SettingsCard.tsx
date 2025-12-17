import { Card } from '../ui/Card'
import { Button } from '../ui/Button'

interface SettingsCardProps {
  title: string;
  description: string;
  buttonText: string;
  onButtonClick?: () => void;
}

export function SettingsCard({ title, description, buttonText, onButtonClick }: SettingsCardProps) {
  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">{title}</h2>
      <p className="text-gray-600 mb-4">{description}</p>
      <Button color="blue" size="sm" onClick={onButtonClick}>
        {buttonText}
      </Button>
    </Card>
  );
}

export function SettingsPage() {
  const settingsCards = [
    {
      title: "Account Settings",
      description: "Manage your account preferences and settings.",
      buttonText: "Edit Account",
      onButtonClick: () => console.log("Edit Account clicked")
    },
    {
      title: "Privacy Settings", 
      description: "Control who can see your content and profile.",
      buttonText: "Manage Privacy",
      onButtonClick: () => console.log("Manage Privacy clicked")
    },
    {
      title: "Notifications",
      description: "Choose what notifications you want to receive.",
      buttonText: "Configure Notifications", 
      onButtonClick: () => console.log("Configure Notifications clicked")
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>
      <div className="space-y-6">
        {settingsCards.map((card, index) => (
          <SettingsCard key={index} {...card} />
        ))}
      </div>
    </div>
  );
}