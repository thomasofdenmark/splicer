'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';

interface DealsSortSelectProps {
  selectedSort: string;
}

export default function DealsSortSelect({ selectedSort }: DealsSortSelectProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSortChange = (sort: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1'); // Reset to first page when sorting changes
    
    if (sort && sort !== 'newest') {
      params.set('sort', sort);
    } else {
      params.delete('sort');
    }
    
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <select 
      className="rounded-md border-gray-300 text-sm focus:border-indigo-500 focus:ring-indigo-500"
      value={selectedSort}
      onChange={(e) => handleSortChange(e.target.value)}
    >
      <option value="newest">Sort by: Newest</option>
      <option value="ending_soon">Sort by: Ending Soon</option>
      <option value="popular">Sort by: Most Popular</option>
      <option value="discount_high">Sort by: Highest Discount</option>
    </select>
  );
} 