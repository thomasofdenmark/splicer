import { ArrowPathIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

import { fetchLatestDeals } from '@/app/lib/data';
import { display } from '@/app/ui/fonts';

const statusColorMap = {
  open: 'text-green-600',
  pending: 'text-yellow-600', 
  closed: 'text-blue-600',
};

export default async function LatestDeals() {
  const latestDeals = await fetchLatestDeals();

  return (
    <div className="flex w-full flex-col md:col-span-4">
      <h2 className={`${display.className} mb-4 text-xl md:text-2xl`}>
        Latest Deals
      </h2>
      <div className="flex grow flex-col justify-between rounded-xl bg-gray-50 p-4">
        <div className="bg-white px-6">
          {latestDeals.map((deal, i) => {
            return (
              <div
                key={deal.id}
                className={clsx(
                  'flex flex-row items-center justify-between py-4',
                  {
                    'border-t': i !== 0,
                  },
                )}
              >
                <div className="flex items-center">
                  <div className="mr-4 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                    <span className="text-sm font-semibold text-gray-600">
                      {deal.company.charAt(0)}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold md:text-base">
                      {deal.title}
                    </p>
                    <p className="hidden text-sm text-gray-500 sm:block">
                      {deal.company}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <p
                    className={`${display.className} truncate text-sm font-medium md:text-base`}
                  >
                    {deal.value}
                  </p>
                  <p className={`text-xs font-medium ${statusColorMap[deal.status]}`}>
                    {deal.status.toUpperCase()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex items-center pb-2 pt-6">
          <ArrowPathIcon className="h-5 w-5 text-gray-500" />
          <h3 className="ml-2 text-sm text-gray-500 ">Updated just now</h3>
        </div>
      </div>
    </div>
  );
}
