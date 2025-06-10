import { PlusIcon } from '@heroicons/react/24/outline';
import { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';

import { fetchAllDealsForAdmin } from '@/app/lib/deal-data';
import { fetchCategories } from '@/app/lib/product-data';
import AdminDealsFilters from '@/app/ui/deals/admin-deals-filters';
import AdminDealsTable from '@/app/ui/deals/admin-deals-table';
import DealsSkeleton from '@/app/ui/deals/deals-skeleton';

export const metadata: Metadata = {
  title: 'Manage Deals | Admin Dashboard',
  description: 'Manage all group deals in the system.',
};

export default async function AdminDealsPage({
  searchParams,
}: {
  searchParams: Promise<{
    query?: string;
    category?: string;
    status?: string;
    sort?: string;
    page?: string;
  }>;
}) {
  const params = await searchParams;
  const query = params?.query || '';
  const category = params?.category || '';
  const status = params?.status || '';
  const sort = params?.sort || 'newest';
  const currentPage = Number(params?.page) || 1;

  // Fetch data in parallel
  const [dealsData, categories] = await Promise.all([
    fetchAllDealsForAdmin(query, category, status, currentPage, 20, sort),
    fetchCategories(),
  ]);

  const statusCounts = {
    all: dealsData.pagination.total,
    pending: 0,
    active: 0,
    completed: 0,
    cancelled: 0,
    expired: 0,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Deals</h1>
          <p className="mt-1 text-sm text-gray-600">
            View and manage all group deals in the system
          </p>
        </div>
        <Link
          href="/dashboard/deals/create"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Create Deal
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-600">All</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Deals
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {statusCounts.all}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-yellow-600">P</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Pending
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {dealsData.data.filter(d => d.status === 'pending').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-green-600">A</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Active
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {dealsData.data.filter(d => d.status === 'active').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-blue-600">C</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Completed
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {dealsData.data.filter(d => d.status === 'completed').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-red-600">X</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Cancelled
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {dealsData.data.filter(d => d.status === 'cancelled').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      {/* <div className="bg-white shadow rounded-lg">
        <div className="p-6"> */}
          <AdminDealsFilters 
            categories={categories}
            selectedCategory={category}
            selectedStatus={status}
            selectedSort={sort}
          />
        {/* </div>
      </div> */}

      {/* Deals Table */}
      {/* <div className="bg-white shadow rounded-lg"> */}
        <Suspense fallback={<DealsSkeleton />}>
          <AdminDealsTable 
            deals={dealsData.data}
            pagination={dealsData.pagination}
            searchQuery={query}
          />
        </Suspense>
      {/* </div> */}
    </div>
  );
} 