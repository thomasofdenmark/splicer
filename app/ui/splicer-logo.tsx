import { UserGroupIcon } from '@heroicons/react/24/outline';

import { display } from '@/app/ui/fonts';

export default function SplicerLogo() {
  return (
    <div
      className={`${display.className} flex flex-row items-center`}
    >
      <UserGroupIcon className="size-8 me-2" />
      <p className="text-[28px] font-semibold">Splicer</p>
    </div>
  );
} 