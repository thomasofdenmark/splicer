import Link from 'next/link';

import { display } from '@/app/ui/fonts';

export default async function Page() {
  // Session auth removed - used in commented role-based buttons section

  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className="mt-8 flex justify-center">
        <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-3/5 md:px-20">
          <p
            className={`${display.className} text-xl text-gray-800 md:text-3xl text-center mb-10`}
          >
            Join group deals and save more when buying together. Discover great products at better prices!
          </p>
          
          {/* Dynamic CTA based on user role */}
          <div className="flex justify-center gap-3">
            <Link
              href="/deals"
              className="flex items-center gap-3 self-start rounded-lg bg-indigo-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-indigo-500 md:text-base"
            >
              <span>Active Deals</span>
              <svg className="w-5 md:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </Link>
            
            <Link
              href="/products"
              className="flex items-center gap-3 self-start rounded-lg bg-indigo-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-indigo-500 md:text-base"
            >
              <span>Browse Products</span>
              <svg className="w-5 md:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>

            {/* Role-based buttons */}
            {/* {isLoggedIn ? (
              <>
                <Link
                  href="/my-dashboard"
                  className="flex items-center gap-3 self-start rounded-lg bg-purple-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-purple-500 md:text-base"
                >
                  <span>My Dashboard</span>
                  <svg className="w-5 md:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </Link>
                
                {isAdmin && (
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-3 self-start rounded-lg bg-emerald-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-emerald-400 md:text-base"
                  >
                    <span>Admin Dashboard</span>
                    <UserGroupIcon className="w-5 md:w-6" />
                  </Link>
                )}
                
                <Link
                  href="/dashboard/deals/create"
                  className="flex items-center gap-3 self-start rounded-lg bg-orange-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-orange-500 md:text-base"
                >
                  <span>Create Deal</span>
                  <svg className="w-5 md:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </Link>
              </>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-3 self-start rounded-lg bg-emerald-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-emerald-400 md:text-base"
              >
                <span>Login</span> <UserGroupIcon className="w-5 md:w-6" />
              </Link>
            )} */}
          </div>
        </div>
      </div>
    </main>
  );
}
