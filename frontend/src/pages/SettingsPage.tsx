import React, { useState } from 'react';
import { ProfileSettings } from '../components/settings/ProfileSettings';
import { PrivacySettings } from '../components/settings/PrivacySettings';
import { SecuritySettings } from '../components/settings/SecuritySettings';
import { ActivitySettings } from '../components/settings/ActivitySettings';
import { Shield, Lock, Activity, UserCircle } from 'lucide-react';
import { cn } from '../lib/utils';

type SettingsTab = 'profile' | 'privacy' | 'security' | 'activity';

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');

  const tabs = [
    { id: 'profile' as const, label: 'Profile', icon: UserCircle },
    { id: 'privacy' as const, label: 'Privacy', icon: Lock },
    { id: 'security' as const, label: 'Security', icon: Shield },
    { id: 'activity' as const, label: 'Data & Activity', icon: Activity },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'profile': return <ProfileSettings />;
      case 'privacy': return <PrivacySettings />;
      case 'security': return <SecuritySettings />;
      case 'activity': return <ActivitySettings />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] pt-4 pb-20">
      <div className="mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
            Settings
          </h1>
          <p className="text-gray-500">
            Manage your account preferences, privacy, and security.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar Tabs */}
          <div className="lg:col-span-4 space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200",
                    isActive
                      ? "bg-white text-orange-600 shadow-sm ring-1 ring-gray-200"
                      : "text-gray-500 hover:text-gray-900 hover:bg-gray-100/50"
                  )}
                >
                  <Icon size={20} className={cn(
                    "transition-colors",
                    isActive ? "text-orange-600" : "text-gray-400 group-hover:text-gray-600"
                  )} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Content Area */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 min-h-[500px] transition-all duration-300">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage