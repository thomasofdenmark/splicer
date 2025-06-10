import { 
  ShoppingBagIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  CurrencyDollarIcon,
  CubeIcon
} from '@heroicons/react/24/outline';

import type { UserDealStats } from '@/app/lib/user-data';
import { formatCurrency } from '@/app/lib/utils';

interface StatsCardsProps {
  stats: UserDealStats;
}

export default function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {/* Total Participations */}
      <div className="rounded-xl bg-gray-50 p-6 shadow-sm">
        <div className="flex items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500">
            <ShoppingBagIcon className="h-6 w-6 text-white" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Total Deals</p>
            <p className="text-2xl font-semibold text-gray-900">
              {stats.total_participations}
            </p>
          </div>
        </div>
      </div>

      {/* Active Deals */}
      <div className="rounded-xl bg-gray-50 p-6 shadow-sm">
        <div className="flex items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-500">
            <ClockIcon className="h-6 w-6 text-white" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Active Deals</p>
            <p className="text-2xl font-semibold text-gray-900">
              {stats.active_deals}
            </p>
          </div>
        </div>
      </div>

      {/* Completed Deals */}
      <div className="rounded-xl bg-gray-50 p-6 shadow-sm">
        <div className="flex items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500">
            <CheckCircleIcon className="h-6 w-6 text-white" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Completed</p>
            <p className="text-2xl font-semibold text-gray-900">
              {stats.completed_deals}
            </p>
          </div>
        </div>
      </div>

      {/* Total Savings */}
      <div className="rounded-xl bg-gray-50 p-6 shadow-sm">
        <div className="flex items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500">
            <CurrencyDollarIcon className="h-6 w-6 text-white" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Total Savings</p>
            <p className="text-2xl font-semibold text-gray-900">
              {formatCurrency(stats.total_savings)}
            </p>
          </div>
        </div>
      </div>

      {/* Total Items */}
      <div className="rounded-xl bg-gray-50 p-6 shadow-sm">
        <div className="flex items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500">
            <CubeIcon className="h-6 w-6 text-white" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Items Ordered</p>
            <p className="text-2xl font-semibold text-gray-900">
              {stats.total_quantity}
            </p>
          </div>
        </div>
      </div>

      {/* Cancelled Deals */}
      <div className="rounded-xl bg-gray-50 p-6 shadow-sm">
        <div className="flex items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-500">
            <XCircleIcon className="h-6 w-6 text-white" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Cancelled</p>
            <p className="text-2xl font-semibold text-gray-900">
              {stats.cancelled_deals}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 