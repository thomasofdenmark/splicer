import {
  BriefcaseIcon,
  CubeIcon,
  UserGroupIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

import { fetchDashboardCardData } from '@/app/lib/data';
import { display } from '@/app/ui/fonts';

const iconMap = {
  deals: BriefcaseIcon,
  products: CubeIcon,
  users: UserGroupIcon,
  active: CheckCircleIcon,
};

export default async function CardWrapper() {
  const {
    totalDeals,
    totalProducts,
    totalUsers,
    activeDeals,
  } = await fetchDashboardCardData();

  return (
    <>
      <Card title="Total Deals" value={totalDeals} type="deals" />
      <Card title="Products" value={totalProducts} type="products" />
      <Card title="Total Users" value={totalUsers} type="users" />
      <Card title="Active Deals" value={activeDeals} type="active" />
    </>
  );
}

export function Card({
  title,
  value,
  type,
}: {
  title: string;
  value: number | string;
  type: 'deals' | 'products' | 'users' | 'active';
}) {
  const Icon = iconMap[type];

  return (
    <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
      <div className="flex p-4">
        {Icon ? <Icon className="h-5 w-5 text-gray-700" /> : null}
        <h3 className="ml-2 text-sm font-medium">{title}</h3>
      </div>
      <p
        className={`${display.className} truncate rounded-xl bg-white px-4 py-8 text-center text-2xl`}
      >
        {value}
      </p>
    </div>
  );
}
