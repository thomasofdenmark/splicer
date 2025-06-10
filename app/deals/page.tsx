import { Metadata } from 'next';
import { Suspense } from 'react';

import { searchDeals } from '@/app/lib/deal-data';
import { fetchCategories } from '@/app/lib/product-data';
import DealsFilters from '@/app/ui/deals/deals-filters';
import DealsGrid from '@/app/ui/deals/deals-grid';
import DealsGridSkeleton from '@/app/ui/deals/deals-grid-skeleton';
import DealsSearch from '@/app/ui/deals/deals-search';
import DealsSortSelect from '@/app/ui/deals/deals-sort-select';

export const metadata: Metadata = {
  title: 'Group Deals | Group Buying Platform',
  description: 'Browse active group deals and save money by buying together.',
};

export default async function DealsPage({
  searchParams,
}: {
  searchParams: Promise<{
    query?: string;
    category?: string;
    minDiscount?: string;
    status?: string;
    sort?: string;
    page?: string;
  }>;
}) {
  const params = await searchParams;
  const query = params?.query || '';
  const category = params?.category || '';
  const minDiscount = params?.minDiscount ? parseFloat(params.minDiscount) : undefined;
  const status = params?.status || '';
  const sort = params?.sort || 'newest';
  const currentPage = Number(params?.page) || 1;

  // Fetch data in parallel - using searchDeals instead of fetchActiveDeals to support filtering
  const [dealsData, categories] = await Promise.all([
    searchDeals(query, category, minDiscount, status, currentPage, 12, sort),
    fetchCategories(),
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Filters Sidebar */}
          <div className="hidden lg:block">
            <div className="sticky top-8">
              <DealsFilters 
                categories={categories}
                selectedCategory={category}
                minDiscount={minDiscount}
                selectedStatus={status}
              />
            </div>
          </div>

          {/* Deals */}
          <div className="mt-6 lg:col-span-3 lg:mt-0">
            {/* Search */}
            <div className="mb-6">
              <DealsSearch placeholder="Search deals..." />
            </div>

            {/* Mobile Filters Toggle */}
            <div className="mb-6 lg:hidden">
              <button
                type="button"
                className="flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
              >
                Filters
              </button>
            </div>

            {/* Stats Bar */}
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                {dealsData.pagination.total} active deals
              </p>
              <DealsSortSelect selectedSort={sort} />
            </div>

            {/* Deals Grid */}
            <Suspense fallback={<DealsGridSkeleton />}>
              <DealsGrid 
                deals={dealsData.data}
                pagination={dealsData.pagination}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
} 