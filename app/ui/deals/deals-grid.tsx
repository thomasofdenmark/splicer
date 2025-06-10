import Image from 'next/image';
import Link from 'next/link';
import { GroupDealWithProduct, PaginatedResponse } from '@/app/lib/group-buying-types';
import { formatCurrency } from '@/app/lib/utils';

interface DealsGridProps {
  deals: GroupDealWithProduct[];
  pagination: PaginatedResponse<GroupDealWithProduct>['pagination'];
}

export default function DealsGrid({ deals, pagination }: DealsGridProps) {
  if (deals.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto max-w-md">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No active deals found</h3>
          <p className="mt-2 text-gray-500">
            Be the first to start a group deal for a product you want!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {deals.map((deal) => (
          <DealCard key={deal.id} deal={deal} />
        ))}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 pt-6">
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              disabled={!pagination.hasPrev}
              className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>
            <button
              disabled={!pagination.hasNext}
              className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> to{' '}
                <span className="font-medium">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of{' '}
                <span className="font-medium">{pagination.total}</span> results
              </p>
            </div>
            <div>
              <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                <button
                  disabled={!pagination.hasPrev}
                  className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300">
                  {pagination.page} of {pagination.totalPages}
                </span>
                <button
                  disabled={!pagination.hasNext}
                  className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DealCard({ deal }: { deal: GroupDealWithProduct }) {
  const progressPercentage = (deal.current_participants / deal.target_participants) * 100;
  const timeRemaining = new Date(deal.end_date).getTime() - new Date().getTime();
  const hoursRemaining = Math.max(0, Math.floor(timeRemaining / (1000 * 60 * 60)));
  const isAlmostFull = progressPercentage >= 80;
  const isEndingSoon = hoursRemaining <= 24;

  return (
    <Link
      href={`/deals/${deal.id}`}
      className="group relative bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
    >
      <div className="aspect-h-2 aspect-w-3 w-full overflow-hidden bg-gray-200">
        <Image
          src={deal.product_image_url || 'https://picsum.photos/400/300'}
          alt={deal.product_name}
          width={400}
          height={300}
          className="h-full w-full object-cover object-center group-hover:opacity-75 transition-opacity"
        />
        <div className="absolute top-2 left-2 flex gap-2">
          <div className="bg-red-600 text-white px-2 py-1 text-xs font-semibold rounded">
            -{deal.discount_percentage}%
          </div>
          {isEndingSoon && (
            <div className="bg-orange-600 text-white px-2 py-1 text-xs font-semibold rounded">
              Ending Soon
            </div>
          )}
          {isAlmostFull && (
            <div className="bg-green-600 text-white px-2 py-1 text-xs font-semibold rounded">
              Almost Full
            </div>
          )}
        </div>
      </div>
      
      <div className="p-4">
        <div className="mb-2">
          <h3 className="text-lg font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">
            {deal.title}
          </h3>
          <p className="text-sm text-gray-500">{deal.product_name}</p>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-semibold text-gray-900">
              {formatCurrency(deal.deal_price)}
            </span>
            <span className="text-sm text-gray-500 line-through">
              {formatCurrency(deal.original_price)}
            </span>
          </div>
          <span className="text-sm font-medium text-green-600">
            Save {formatCurrency(deal.original_price - deal.deal_price)}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
            <span>{deal.current_participants} joined</span>
            <span>{deal.target_participants} needed</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {Math.round(progressPercentage)}% complete
          </p>
        </div>

        {/* Time Remaining */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">
            {hoursRemaining > 0 ? `${hoursRemaining}h remaining` : 'Expired'}
          </span>
          <span className="text-indigo-600 font-medium">
            Join Deal →
          </span>
        </div>
      </div>
    </Link>
  );
} 