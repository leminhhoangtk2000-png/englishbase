'use client';

import PremiumUpgrade from '@/components/PremiumUpgrade';

export default function PremiumPage() {
  // TODO: Get current user data from authentication
  const currentUser = {
    id: 'sample-user-id',
    isPremium: false
  };

  const handleUpgradeSuccess = () => {
    // Redirect to dashboard or reload user data
    window.location.href = '/dashboard';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto py-12 px-4">
        <PremiumUpgrade 
          userId={currentUser.id}
          currentPlan={currentUser.isPremium ? 'premium' : 'free'}
          onUpgradeSuccess={handleUpgradeSuccess}
        />
      </div>
    </div>
  );
}
