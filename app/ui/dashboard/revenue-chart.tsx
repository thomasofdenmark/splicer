import { BriefcaseIcon } from '@heroicons/react/24/outline';

import { fetchDealStats } from '@/app/lib/data';
import { display } from '@/app/ui/fonts';

// This component is representational only.
// For data visualization UI, check out:
// https://www.tremor.so/
// https://www.chartjs.org/
// https://airbnb.io/visx/

export default async function DealsChart() {
  const dealStats = await fetchDealStats();

  const chartHeight = 350;
  
  if (!dealStats || dealStats.length === 0) {
    return <p className="mt-4 text-gray-400">No data available.</p>;
  }

  // Find the maximum value for scaling
  const maxDeals = Math.max(...dealStats.map(stat => stat.deals));
  const yAxisLabels = [];
  for (let i = 0; i <= 5; i++) {
    yAxisLabels.push(Math.round((maxDeals * i) / 5).toString());
  }
  yAxisLabels.reverse();

  return (
    <div className="w-full md:col-span-4">
      <h2 className={`${display.className} mb-4 text-xl md:text-2xl`}>
        Deals Overview
      </h2>
      <div className="rounded-xl bg-gray-50 p-4">
        <div className="sm:grid-cols-13 mt-0 grid grid-cols-12 items-end gap-2 rounded-md bg-white p-4 md:gap-4">
          {/* y-axis */}
          <div
            className="mb-6 hidden flex-col justify-between text-sm text-gray-400 sm:flex"
            style={{ height: `${chartHeight}px` }}
          >
            {yAxisLabels.map((label) => (
              <p key={label}>{label}</p>
            ))}
          </div>

          {dealStats.map((stat) => (
            <div key={stat.month} className="flex flex-col items-center gap-2">
              {/* bars */}
              <div
                className="w-full rounded-md bg-blue-400"
                style={{
                  height: `${(chartHeight / maxDeals) * stat.deals}px`,
                }}
              ></div>
              {/* x-axis */}
              <p className="-rotate-90 text-sm text-gray-400 sm:rotate-0">
                {stat.month}
              </p>
            </div>
          ))}
        </div>
        <div className="flex items-center pb-2 pt-6">
          <BriefcaseIcon className="h-5 w-5 text-gray-500" />
          <h3 className="ml-2 text-sm text-gray-500 ">Last 12 months</h3>
        </div>
      </div>
    </div>
  );
}
