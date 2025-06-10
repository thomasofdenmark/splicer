'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { 
  UserCircleIcon, 
  ChevronDownIcon,
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
  PlusIcon,
  ShoppingBagIcon,
  ShieldCheckIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import SplicerLogo from '@/app/ui/splicer-logo';

export default function TopNavigation() {
  const { data: session, status } = useSession();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Wait for session to load to prevent hydration mismatch
  if (status === 'loading') {
    return (
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex-shrink-0">
                <SplicerLogo />
              </Link>
            </div>

            {/* Loading state for right side */}
            <div className="flex items-center">
              <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  const isLoggedIn = !!session?.user;
  const isAdmin = session?.user?.role === 'admin';

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <SplicerLogo />
            </Link>
          </div>

          {/* Center Navigation - Dynamic CTAs */}
          {/* <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/deals"
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
            >
              <ShoppingBagIcon className="mr-2 h-4 w-4" />
              Browse Deals
            </Link>

            {isLoggedIn && (
              <>
                {isAdmin && (
                  <Link
                    href="/products"
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-700 hover:text-blue-900 hover:bg-blue-50 rounded-md transition-colors"
                  >
                    Products
                  </Link>
                )}
              </>
            )}
          </div> */}

          {/* Right side - User Profile or Login */}
          <div className="flex items-center">
            {isLoggedIn ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center max-w-xs text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 p-2 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">

                    <div className="flex items-center space-x-2">
                      {isAdmin ? (
                        <ShieldCheckIcon className="h-5 w-5 text-blue-600" />
                      ) : (
                        <UserIcon className="h-5 w-5 text-gray-600" />
                      )}
                      <div className="hidden sm:block text-left">
                        <p className="text-sm font-medium text-gray-900">
                          {session.user.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {isAdmin ? 'Admin' : 'User'}
                        </p>
                      </div>
                    </div>
                    <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                  </div>
                </button>

                {/* Dropdown Menu */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                    <div className="py-1">
                      {/* User Info Header */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">
                          {session.user.name}
                          {isAdmin ? ' - (Admin)' : ''}
                        </p>
                        <p className="text-sm text-gray-500">
                          {session.user.email}
                          {isAdmin ? 'Administrator' : ''}
                        </p>
                      </div>

                      {/* Menu Items */}
                      {!isAdmin && (
                        <Link
                          href="/my-dashboard"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <UserCircleIcon className="mr-3 h-4 w-4" />
                          My Dashboard
                        </Link>
                      )}
                      {isAdmin && (
                        <Link
                          href="/dashboard"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <Cog6ToothIcon className="mr-3 h-4 w-4" />
                          Admin Dashboard
                        </Link>
                      )}

                      <div className="border-t border-gray-100">
                        <button
                          onClick={() => {
                            setIsProfileOpen(false);
                            handleSignOut();
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <ArrowRightOnRectangleIcon className="mr-3 h-4 w-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile menu - shown on small screens */}
        {isLoggedIn && (
          <div className="md:hidden border-t border-gray-200 py-3">
            <div className="flex items-center justify-center space-x-4">
              <Link
                href="/deals"
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
              >
                <ShoppingBagIcon className="mr-2 h-4 w-4" />
                Deals
              </Link>
              <Link
                href="/my-dashboard"
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-purple-700 hover:text-purple-900 hover:bg-purple-50 rounded-md"
              >
                <UserCircleIcon className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
              <Link
                href="/dashboard/deals/create"
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-green-700 hover:text-green-900 hover:bg-green-50 rounded-md"
              >
                <PlusIcon className="mr-2 h-4 w-4" />
                Create
              </Link>
              {isAdmin && (
                <Link
                  href="/dashboard"
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-700 hover:text-blue-900 hover:bg-blue-50 rounded-md"
                >
                  <ShieldCheckIcon className="mr-2 h-4 w-4" />
                  Admin
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
} 