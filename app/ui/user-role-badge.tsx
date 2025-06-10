'use client';

import { useSession } from 'next-auth/react';
import { ShieldCheckIcon, UserIcon } from '@heroicons/react/24/outline';

export default function UserRoleBadge() {
  const { data: session } = useSession();
  
  if (!session?.user) return null;

  const isAdmin = session.user.role === 'admin';

  return (
    <div className="flex items-center space-x-2">
      <div className="flex items-center">
        {isAdmin ? (
          <ShieldCheckIcon className="h-4 w-4 text-blue-600" />
        ) : (
          <UserIcon className="h-4 w-4 text-gray-600" />
        )}
        <span className={`ml-1 text-xs font-medium ${
          isAdmin ? 'text-blue-600' : 'text-gray-600'
        }`}>
          {isAdmin ? 'Admin' : 'User'}
        </span>
      </div>
    </div>
  );
} 