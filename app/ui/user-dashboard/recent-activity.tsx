import Link from 'next/link';
import Image from 'next/image';
import { 
  ClockIcon, 
  ArrowRightIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { formatDateToLocal, formatCurrency } from '@/app/lib/utils';
import type { UserDealParticipation } from '@/app/lib/user-data';

interface RecentActivityProps {
  participations: UserDealParticipation[];
}

export default function RecentActivity({ participations }: RecentActivityProps) {
  // Get the 5 most recent participations
  const recentParticipations = participations.slice(0, 5);

  if (recentParticipations.length === 0) {
    return (
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
        <div className="text-center py-8">
          <ClockIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h4 className="mt-4 text-sm font-medium text-gray-900">No recent activity</h4>
          <p className="mt-2 text-sm text-gray-500">
            Start participating in deals to see your activity here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
        <Link
          href="/my-dashboard"
          className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center"
        >
          View all
          <ArrowRightIcon className="ml-1 h-4 w-4" />
        </Link>
      </div>
      
      <div className="space-y-4">
        {recentParticipations.map((participation) => (
          <div key={participation.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50">
            <div className="flex-shrink-0">
              <Image
                className="h-10 w-10 rounded-lg object-cover"
                src={participation.product_image_url || '/placeholder-product.png'}
                alt={participation.product_name}
                width={40}
                height={40}
              />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {participation.deal_title}
                </p>
                <div className="flex items-center">
                  {participation.deal_status === 'pending' && participation.progress_percentage < 50 && (
                    <ExclamationTriangleIcon className="h-4 w-4 text-amber-500 mr-1" />
                  )}
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    participation.deal_status === 'active' ? 'bg-green-100 text-green-800' :
                    participation.deal_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    participation.deal_status === 'completed' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {participation.deal_status}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-1">
                <p className="text-sm text-gray-500">
                  Qty: {participation.quantity} • {formatCurrency(participation.deal_price * participation.quantity)}
                </p>
                <p className="text-xs text-gray-400">
                  {formatDateToLocal(participation.joined_at)}
                </p>
              </div>
              
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className="bg-blue-600 h-1.5 rounded-full transition-all duration-300" 
                    style={{ width: `${Math.min(participation.progress_percentage, 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {participation.progress_percentage}% of target reached
                </p>
              </div>
            </div>
            
            <div className="flex-shrink-0">
              <Link
                href={`/deals/${participation.deal_id}`}
                className="text-blue-600 hover:text-blue-700"
              >
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 