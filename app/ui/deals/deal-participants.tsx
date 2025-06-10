import Image from 'next/image';
import { UserIcon } from '@heroicons/react/24/outline';
import type { DealParticipantWithUser } from '@/app/lib/group-buying-types';

interface DealParticipantsProps {
  participants: DealParticipantWithUser[];
  dealTitle: string;
}

export default function DealParticipants({ participants, dealTitle }: DealParticipantsProps) {
  if (participants.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No participants yet</h3>
        <p className="mt-1 text-sm text-gray-500">Be the first to join this group deal!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">
          Participants ({participants.length})
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          People who have joined "{dealTitle}"
        </p>
      </div>
      
      <div className="divide-y divide-gray-200">
        {participants.map((participant) => (
          <div key={participant.id} className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {participant.avatar_url ? (
                  <Image
                    src={participant.avatar_url}
                    alt={participant.user_name}
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-full"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                    <UserIcon className="h-6 w-6 text-gray-500" />
                  </div>
                )}
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-900">
                  {participant.user_name}
                </div>
                <div className="text-sm text-gray-500">
                  Joined {new Date(participant.joined_at).toLocaleDateString()}
                </div>
                {participant.notes && (
                  <div className="text-xs text-gray-400 mt-1 italic">
                    "{participant.notes}"
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">
                  {participant.quantity} {participant.quantity === 1 ? 'item' : 'items'}
                </div>
                <div className="text-xs text-gray-500">
                  {participant.status === 'active' ? 'Active' : participant.status}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {participants.length > 0 && (
        <div className="px-6 py-3 bg-gray-50 text-xs text-gray-500 rounded-b-lg">
          Total items: {participants.reduce((sum, p) => sum + p.quantity, 0)}
        </div>
      )}
    </div>
  );
} 