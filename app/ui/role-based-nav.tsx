'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { 
  HomeIcon, 
  ShoppingBagIcon, 
  PlusCircleIcon,
  ChartBarIcon,
  CogIcon,
  UserGroupIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';

export default function RoleBasedNav() {
  const { data: session } = useSession();
  
  if (!session?.user) return null;

  const isAdmin = session.user.role === 'admin';

  return (
    <nav className="space-y-2">
      {/* Public Navigation - Available to all users */}
      <div className="border-b pb-4 mb-4">
        <h3 className="text-sm font-medium text-gray-500 mb-2">Marketplace</h3>
        <Link
          href="/"
          className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100"
        >
          <HomeIcon className="mr-3 h-5 w-5" />
          Home
        </Link>
        <Link
          href="/deals"
          className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100"
        >
          <ShoppingBagIcon className="mr-3 h-5 w-5" />
          Browse Deals
        </Link>
        <Link
          href="/products"
          className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100"
        >
          <UserGroupIcon className="mr-3 h-5 w-5" />
          Products
        </Link>
      </div>

      {/* User Dashboard - Available to all logged-in users */}
      <div className="border-b pb-4 mb-4">
        <h3 className="text-sm font-medium text-gray-500 mb-2">Your Account</h3>
        <Link
          href="/my-dashboard"
          className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-purple-700 hover:bg-purple-50"
        >
          <UserCircleIcon className="mr-3 h-5 w-5" />
          My Dashboard
        </Link>
      </div>

      {/* User Actions - Available to all logged-in users */}
      <div className="border-b pb-4 mb-4">
        <h3 className="text-sm font-medium text-gray-500 mb-2">Create</h3>
        <Link
          href="/dashboard/deals/create"
          className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100"
        >
          <PlusCircleIcon className="mr-3 h-5 w-5" />
          Create Deal
        </Link>
      </div>

      {/* Admin Only Navigation */}
      {isAdmin && (
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">Administration</h3>
          <Link
            href="/dashboard"
            className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-blue-700 hover:bg-blue-50"
          >
            <ChartBarIcon className="mr-3 h-5 w-5" />
            Admin Dashboard
          </Link>
          <Link
            href="/dashboard/deals"
            className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-blue-700 hover:bg-blue-50"
          >
            <ShoppingBagIcon className="mr-3 h-5 w-5" />
            Manage Deals
          </Link>
          <Link
            href="/dashboard/products"
            className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-blue-700 hover:bg-blue-50"
          >
            <CogIcon className="mr-3 h-5 w-5" />
            Manage Products
          </Link>
          <Link
            href="/dashboard/users"
            className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-blue-700 hover:bg-blue-50"
          >
            <UserGroupIcon className="mr-3 h-5 w-5" />
            Manage Users
          </Link>
        </div>
      )}
    </nav>
  );
} 