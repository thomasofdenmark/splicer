// Unused imports removed - icons are in commented Quick Actions section
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

import { fetchUserDealParticipations, fetchUserDealStats, fetchUserCreatedDeals, UserCreatedDeal } from '@/app/lib/user-data';
import ParticipationTable from '@/app/ui/user-dashboard/participation-table';
import StatsCards from '@/app/ui/user-dashboard/stats-cards';
import { auth } from '@/auth';

export default async function UserDashboard() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect('/login?callbackUrl=/my-dashboard');
  }

  // Fetch user data in parallel
  const [stats, participations, createdDeals] = await Promise.all([
    fetchUserDealStats(session.user.id),
    fetchUserDealParticipations(session.user.id),
    fetchUserCreatedDeals(session.user.id)
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Statistics Cards */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Activity</h2>
            <Suspense fallback={<div>Loading stats...</div>}>
              <StatsCards stats={stats} />
            </Suspense>
          </div>

          {/* Deal Participations */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Your Deal Participations</h2>
              <span className="text-sm text-gray-500">
                {participations.length} total participation{participations.length !== 1 ? 's' : ''}
              </span>
            </div>
            <Suspense fallback={<div>Loading participations...</div>}>
              <ParticipationTable participations={participations} />
            </Suspense>
          </div>

          {/* Created Deals Section */}
          {createdDeals.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Deals You Created</h2>
                <span className="text-sm text-gray-500">
                  {createdDeals.length} deal{createdDeals.length !== 1 ? 's' : ''} created
                </span>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {createdDeals.map((deal: UserCreatedDeal) => (
                  <div key={deal.id} className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium text-gray-900">{deal.title}</h3>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        deal.status === 'active' ? 'bg-green-100 text-green-800' :
                        deal.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        deal.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {deal.status}
                      </span>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                      <p>Product: {deal.product_name}</p>
                      <p>Participants: {deal.current_participants} / {deal.target_participants}</p>
                      <p>Progress: {deal.progress_percentage}%</p>
                    </div>
                    
                    <div className="mt-4">
                      <Link
                        href={`/deals/${deal.id}`}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        View Deal →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          {/* <div className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Link
                href="/deals"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <ChartBarIcon className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <div className="font-medium text-gray-900">Browse Deals</div>
                  <div className="text-sm text-gray-500">Find new deals to join</div>
                </div>
              </Link>
              
              <Link
                href="/dashboard/deals/create"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <PlusIcon className="h-8 w-8 text-green-600 mr-3" />
                <div>
                  <div className="font-medium text-gray-900">Create Deal</div>
                  <div className="text-sm text-gray-500">Start a new group deal</div>
                </div>
              </Link>
              
              <Link
                href="/products"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <Cog6ToothIcon className="h-8 w-8 text-purple-600 mr-3" />
                <div>
                  <div className="font-medium text-gray-900">Browse Products</div>
                  <div className="text-sm text-gray-500">Explore all products</div>
                </div>
              </Link>
              
              <div className="flex items-center p-4 border border-gray-200 rounded-lg bg-gray-50">
                <UserCircleIcon className="h-8 w-8 text-gray-400 mr-3" />
                <div>
                  <div className="font-medium text-gray-500">Profile Settings</div>
                  <div className="text-sm text-gray-400">Coming soon</div>
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
} 