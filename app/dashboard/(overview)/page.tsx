import { Suspense } from 'react';

import ActiveUsers from '@/app/ui/dashboard/active-users';
import CardWrapper from '@/app/ui/dashboard/cards';
import LatestDeals from '@/app/ui/dashboard/latest-invoices';
import DealsChart from '@/app/ui/dashboard/revenue-chart';
import { display } from '@/app/ui/fonts';
import {
  DealsChartSkeleton,
  LatestDealsSkeleton,
  ActiveUsersSkeleton,
  CardsSkeleton,
} from '@/app/ui/skeletons';

export default async function Page() {
  return (
    <main>
      <h1 className={`${display.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<CardsSkeleton />}>
          <CardWrapper />
        </Suspense>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <Suspense fallback={<DealsChartSkeleton />}>
          <DealsChart />
        </Suspense>
        <Suspense fallback={<LatestDealsSkeleton />}>
          <LatestDeals />
        </Suspense>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <Suspense fallback={<ActiveUsersSkeleton />}>
          <ActiveUsers />
        </Suspense>
      </div>
    </main>
  );
}
