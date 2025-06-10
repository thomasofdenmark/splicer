import Image from 'next/image';
import Link from 'next/link';
import { 
  CalendarDaysIcon, 
  UsersIcon,
  ChartBarIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { formatCurrency, formatDateToLocal } from '@/app/lib/utils';
import type { UserDealParticipation } from '@/app/lib/user-data';

interface ParticipationTableProps {
  participations: UserDealParticipation[];
}

function StatusBadge({ status }: { status: string }) {
  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'active':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'expired':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusStyles(status)}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function ProgressBar({ percentage }: { percentage: number }) {
  return (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div 
        className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
        style={{ width: `${Math.min(percentage, 100)}%` }}
      ></div>
    </div>
  );
}

export default function ParticipationTable({ participations }: ParticipationTableProps) {
  if (participations.length === 0) {
    return (
      <div className="rounded-lg bg-gray-50 p-8 text-center">
        <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-4 text-lg font-medium text-gray-900">No deal participations yet</h3>
        <p className="mt-2 text-sm text-gray-600">
          Start participating in group deals to see your activity here.
        </p>
        <Link
          href="/deals"
          className="mt-4 inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Browse Deals
        </Link>
      </div>
    );
  }

  return (
    <div className="flow-root">
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                    Deal & Product
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    My Order
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Progress
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Status
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Joined
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {participations.map((participation) => (
                  <tr key={participation.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 sm:pl-6">
                      <div className="flex items-center">
                        <div className="h-16 w-16 flex-shrink-0">
                          <Image
                            className="h-16 w-16 rounded-lg object-cover"
                            src={participation.product_image_url || '/placeholder-product.png'}
                            alt={participation.product_name}
                            width={64}
                            height={64}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-gray-900">
                            {participation.deal_title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {participation.product_name}
                          </div>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <span className="font-medium text-green-600">
                              {formatCurrency(participation.deal_price)}
                            </span>
                            <span className="ml-2 line-through text-gray-400">
                              {formatCurrency(participation.original_price)}
                            </span>
                            <span className="ml-2 text-green-600 font-medium">
                              -{participation.discount_percentage}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                      <div>
                        <div className="font-medium">Qty: {participation.quantity}</div>
                        <div className="text-gray-500">
                          Total: {formatCurrency(participation.deal_price * participation.quantity)}
                        </div>
                        {participation.notes && (
                          <div className="text-xs text-gray-400 mt-1" title={participation.notes}>
                            "{participation.notes.substring(0, 30)}{participation.notes.length > 30 ? '...' : ''}"
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                      <div className="space-y-2">
                        <div className="flex items-center text-sm">
                          <UsersIcon className="h-4 w-4 text-gray-400 mr-1" />
                          <span>{participation.current_participants} / {participation.target_participants}</span>
                        </div>
                        <ProgressBar percentage={participation.progress_percentage} />
                        <div className="text-xs text-gray-500">
                          {participation.progress_percentage}% complete
                        </div>
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      <div className="space-y-2">
                        <StatusBadge status={participation.deal_status} />
                        {participation.participation_status !== 'active' && (
                          <div>
                            <StatusBadge status={participation.participation_status} />
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <CalendarDaysIcon className="h-4 w-4 text-gray-400 mr-1" />
                        {formatDateToLocal(participation.joined_at)}
                      </div>
                    </td>

                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <Link
                        href={`/deals/${participation.deal_id}`}
                        className="inline-flex items-center rounded-md bg-white px-2.5 py-1.5 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                      >
                        <EyeIcon className="h-4 w-4 mr-1" />
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 