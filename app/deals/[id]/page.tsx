import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeftIcon, ClockIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { fetchDealById, fetchDealParticipants, fetchDealStats, fetchUserParticipation } from '@/app/lib/deal-data';
import { formatCurrency } from '@/app/lib/utils';
import { auth } from '@/auth';
import { Metadata } from 'next';
import JoinDealForm from '@/app/ui/deals/join-deal-form';
import DealParticipants from '@/app/ui/deals/deal-participants';
import DealProgress from '@/app/ui/deals/deal-progress';
import DealActions from '@/app/ui/deals/deal-actions';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const deal = await fetchDealById(id);
  
  if (!deal) {
    return {
      title: 'Deal Not Found',
    };
  }

  return {
    title: `${deal.title} | Group Deals`,
    description: `Save ${deal.discount_percentage}% on ${deal.product_name}. Join ${deal.current_participants} others in this group deal.`,
  };
}

export default async function DealPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  
  // Fetch all deal data in parallel
  const [deal, participants, stats, userParticipation] = await Promise.all([
    fetchDealById(id),
    fetchDealParticipants(id),
    fetchDealStats(id),
    session?.user?.id ? fetchUserParticipation(session.user.id, id) : null,
  ]);

  if (!deal || !stats) {
    notFound();
  }

  const isExpired = new Date(deal.end_date) < new Date();
  const isUserParticipating = !!userParticipation;
  const canJoin = !isExpired && !isUserParticipating && deal.status !== 'cancelled' && deal.status !== 'completed';
  const isCreator = session?.user?.id === deal.created_by;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <div className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/deals"
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
          >
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back to Deals
          </Link>
        </div>
      </div>

      {/* Deal Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
          {/* Product Image & Deal Info */}
          <div className="flex flex-col">
            <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200">
              <Image
                src={deal.product_image_url || 'https://picsum.photos/600/600'}
                alt={deal.product_name}
                width={600}
                height={600}
                className="h-full w-full object-cover object-center"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                {deal.status === 'active' && (
                  <div className="bg-green-600 text-white px-3 py-1 text-sm font-semibold rounded">
                    ACTIVE
                  </div>
                )}
                {isExpired && (
                  <div className="bg-gray-600 text-white px-3 py-1 text-sm font-semibold rounded">
                    EXPIRED
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Deal Details */}
          <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">{deal.title}</h1>
            
            <div className="mt-3">
              <h2 className="sr-only">Deal pricing</h2>
              <div className="flex items-baseline space-x-3">
                <p className="text-3xl tracking-tight text-gray-900">
                  {formatCurrency(deal.deal_price)}
                </p>
                <p className="text-xl text-gray-500 line-through">
                  {formatCurrency(deal.original_price)}
                </p>
                <p className="text-lg font-medium text-green-600">
                  Save {formatCurrency(deal.original_price - deal.deal_price)}
                </p>
              </div>
            </div>

            {/* Product Info */}
            <div className="mt-6">
              <Link 
                href={`/products/${deal.product_id}`}
                className="mt-1 text-lg text-indigo-600 hover:text-indigo-500"
              >
                {deal.product_name}
              </Link>
              <p className="mt-1 text-sm text-gray-500">{deal.category_name}</p>
            </div>

            {/* Deal Description */}
            {deal.description && (
              <div className="mt-6">
                <div className="mt-4">
                  <p className="text-base text-gray-900">{deal.description}</p>
                </div>
              </div>
            )}

            {/* Progress Section */}
            <div className="mt-8">
              <DealProgress deal={deal} stats={stats} />
            </div>

            {/* Action Section */}
            <div className="mt-8">
              {session?.user ? (
                <div className="space-y-4">
                  {isUserParticipating ? (
                    <div className="rounded-md bg-green-50 p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-green-800">
                            You're part of this deal!
                          </h3>
                          <div className="mt-2 text-sm text-green-700">
                            <p>You joined this deal with {userParticipation.quantity} item(s).</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : canJoin ? (
                    <JoinDealForm dealId={deal.id} />
                  ) : (
                    <div className="rounded-md bg-gray-50 p-4">
                      <p className="text-sm text-gray-600">
                        {isExpired ? 'This deal has expired.' : 
                         deal.status === 'cancelled' ? 'This deal has been cancelled.' :
                         deal.status === 'completed' ? 'This deal is complete.' :
                         'You cannot join this deal at this time.'}
                      </p>
                    </div>
                  )}
                  
                  {(isUserParticipating || isCreator) && (
                    <DealActions 
                      dealId={deal.id} 
                      isCreator={isCreator} 
                      isParticipating={isUserParticipating}
                      dealStatus={deal.status}
                    />
                  )}
                </div>
              ) : (
                <div className="rounded-md bg-blue-50 p-4">
                  <div className="flex">
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800">
                        Sign in to join this deal
                      </h3>
                      <div className="mt-2">
                        <Link
                          href={`/login?callbackUrl=${encodeURIComponent(`/deals/${deal.id}`)}`}
                          className="text-sm font-medium text-blue-800 underline hover:text-blue-600"
                        >
                          Sign in to participate in group deals
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Participants Section - Admin Only */}
        {session?.user?.role === 'admin' && (
          <div className="mt-12">
            <DealParticipants participants={participants} dealTitle={deal.title} />
          </div>
        )}
      </div>
    </div>
  );
} 