'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { leaveDeal, cancelDeal } from '@/app/lib/deal-actions';

interface DealActionsProps {
  dealId: string;
  isCreator: boolean;
  isParticipating: boolean;
  dealStatus: string;
}

export default function DealActions({ 
  dealId, 
  isCreator, 
  isParticipating, 
  dealStatus 
}: DealActionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState<'leave' | 'cancel' | null>(null);
  const router = useRouter();

  const handleLeaveDeal = async () => {
    setIsLoading(true);
    try {
      await leaveDeal(dealId);
      router.refresh();
      setShowConfirm(null);
    } catch (error) {
      console.error('Failed to leave deal:', error);
      alert('Failed to leave deal. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelDeal = async () => {
    setIsLoading(true);
    try {
      await cancelDeal(dealId);
      router.refresh();
      setShowConfirm(null);
    } catch (error) {
      console.error('Failed to cancel deal:', error);
      alert('Failed to cancel deal. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const canCancel = isCreator && (dealStatus === 'pending' || dealStatus === 'active');
  const canLeave = isParticipating && (dealStatus === 'pending' || dealStatus === 'active');

  if (!canCancel && !canLeave) {
    return null;
  }

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <h4 className="text-sm font-medium text-gray-900 mb-3">Deal Actions</h4>
      
      <div className="space-y-2">
        {canLeave && (
          <>
            {showConfirm === 'leave' ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-800 mb-3">
                  Are you sure you want to leave this deal? This action cannot be undone.
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={handleLeaveDeal}
                    disabled={isLoading}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                  >
                    {isLoading ? 'Leaving...' : 'Yes, Leave Deal'}
                  </button>
                  <button
                    onClick={() => setShowConfirm(null)}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowConfirm('leave')}
                className="w-full inline-flex justify-center items-center px-3 py-2 text-sm font-medium text-red-600 bg-white border border-red-300 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Leave Deal
              </button>
            )}
          </>
        )}

        {canCancel && (
          <>
            {showConfirm === 'cancel' ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-800 mb-3">
                  Are you sure you want to cancel this deal? This will remove all participants and cannot be undone.
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={handleCancelDeal}
                    disabled={isLoading}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                  >
                    {isLoading ? 'Cancelling...' : 'Yes, Cancel Deal'}
                  </button>
                  <button
                    onClick={() => setShowConfirm(null)}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowConfirm('cancel')}
                className="w-full inline-flex justify-center items-center px-3 py-2 text-sm font-medium text-red-600 bg-white border border-red-300 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Cancel Deal
              </button>
            )}
          </>
        )}
      </div>

      {isCreator && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            As the deal creator, you can cancel this deal at any time.
          </p>
        </div>
      )}
    </div>
  );
} 