import type { GroupDealWithProduct, GroupDealStats } from '@/app/lib/group-buying-types';

interface DealProgressProps {
  deal: GroupDealWithProduct;
  stats: GroupDealStats;
}

export default function DealProgress({ deal, stats }: DealProgressProps) {
  const participationProgress = (deal.current_participants / deal.target_participants) * 100;
  
  // Calculate duration from deal dates
  const startTime = new Date(deal.start_date).getTime();
  const endTime = new Date(deal.end_date).getTime();
  const durationHours = (endTime - startTime) / (1000 * 60 * 60);
  const timeProgress = ((durationHours - stats.time_remaining_hours) / durationHours) * 100;

  return (
    <div className="space-y-6">
      {/* Participation Progress */}
      <div>
        <div className="flex justify-between text-sm font-medium text-gray-900">
          <span>Participation Progress</span>
          <span>{Math.round(participationProgress)}%</span>
        </div>
        <div className="mt-2">
          <div className="overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-2 bg-indigo-600 transition-all duration-300 ease-in-out"
              style={{ width: `${Math.min(participationProgress, 100)}%` }}
            />
          </div>
        </div>
        <div className="mt-1 flex justify-between text-xs text-gray-500">
          <span>{deal.current_participants} joined</span>
          <span>{deal.target_participants} needed</span>
        </div>
      </div>

      {/* Quantity Progress (if applicable) */}
      {deal.target_quantity && deal.target_quantity > deal.target_participants && (
        <div>
          <div className="flex justify-between text-sm font-medium text-gray-900">
            <span>Quantity Progress</span>
            <span>{Math.round((deal.current_quantity / deal.target_quantity) * 100)}%</span>
          </div>
          <div className="mt-2">
            <div className="overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-2 bg-green-600 transition-all duration-300 ease-in-out"
                style={{ width: `${Math.min((deal.current_quantity / deal.target_quantity) * 100, 100)}%` }}
              />
            </div>
          </div>
          <div className="mt-1 flex justify-between text-xs text-gray-500">
            <span>{deal.current_quantity} items</span>
            <span>{deal.target_quantity} target</span>
          </div>
        </div>
      )}

      {/* Time Progress */}
      <div>
        <div className="flex justify-between text-sm font-medium text-gray-900">
          <span>Time Remaining</span>
          <span>
            {stats.time_remaining_hours > 0 
              ? `${Math.floor(stats.time_remaining_hours)}h ${Math.floor((stats.time_remaining_hours % 1) * 60)}m`
              : 'Expired'
            }
          </span>
        </div>
        <div className="mt-2">
          <div className="overflow-hidden rounded-full bg-gray-200">
            <div
              className={`h-2 transition-all duration-300 ease-in-out ${
                stats.time_remaining_hours <= 24 ? 'bg-red-600' : 
                stats.time_remaining_hours <= 72 ? 'bg-orange-600' : 'bg-blue-600'
              }`}
              style={{ width: `${Math.max(100 - timeProgress, 0)}%` }}
            />
          </div>
        </div>
        <div className="mt-1 flex justify-between text-xs text-gray-500">
          <span>Started: {new Date(deal.start_date).toLocaleDateString()}</span>
          <span>Ends: {new Date(deal.end_date).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Status Indicators */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
        <div className="text-center">
          <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            deal.status === 'active' ? 'bg-green-100 text-green-800' :
            deal.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
            deal.status === 'completed' ? 'bg-blue-100 text-blue-800' :
            'bg-red-100 text-red-800'
          }`}>
            {deal.status.charAt(0).toUpperCase() + deal.status.slice(1)}
          </div>
          <p className="mt-1 text-xs text-gray-500">Status</p>
        </div>
        
        <div className="text-center">
          <div className="text-sm font-medium text-gray-900">
            {deal.discount_percentage}%
          </div>
          <p className="text-xs text-gray-500">Discount</p>
        </div>
        
        <div className="text-center">
          <div className="text-sm font-medium text-gray-900">
            {deal.current_quantity}
          </div>
          <p className="text-xs text-gray-500">Total Items</p>
        </div>
      </div>
    </div>
  );
} 