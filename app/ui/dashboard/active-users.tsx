import { ArrowPathIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Image from 'next/image';

import { fetchActiveUsers } from '@/app/lib/data';
import { display } from '@/app/ui/fonts';

const roleColorMap = {
  admin: 'text-purple-600',
  user: 'text-blue-600',
};

export default async function ActiveUsers() {
  const activeUsers = await fetchActiveUsers();

  return (
    <div className="flex w-full flex-col md:col-span-4">
      <h2 className={`${display.className} mb-4 text-xl md:text-2xl`}>
        Active Users
      </h2>
      <div className="flex grow flex-col justify-between rounded-xl bg-gray-50 p-4">
        <div className="bg-white px-6">
          {activeUsers.map((user, i) => {
            return (
              <div
                key={user.id}
                className={clsx(
                  'flex flex-row items-center justify-between py-4',
                  {
                    'border-t': i !== 0,
                  },
                )}
              >
                <div className="flex items-center">
                  <Image
                    src={user.image_url}
                    alt={`${user.name}'s profile picture`}
                    className="mr-4 rounded-full"
                    width={32}
                    height={32}
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold md:text-base">
                      {user.name}
                    </p>
                    <p className="hidden text-sm text-gray-500 sm:block">
                      {user.email}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <p className={`text-xs font-medium ${roleColorMap[user.role]}`}>
                    {user.role.toUpperCase()}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(user.last_login).toLocaleDateString()}
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