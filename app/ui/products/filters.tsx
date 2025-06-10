'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';

import type { Category } from '@/app/lib/group-buying-types';

export default function ProductFilters({ categories }: { categories: Category[] }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    
    if (value && value !== 'all') {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-4 rounded-lg bg-gray-50 p-4">
      {/* Category Filter */}
      <div className="flex flex-col">
        <label htmlFor="category" className="text-sm font-medium text-gray-700 mb-1">
          Category
        </label>
        <select
          id="category"
          className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          defaultValue={searchParams.get('category') || 'all'}
          onChange={(e) => handleFilterChange('category', e.target.value)}
        >
          <option value="all">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range Filters */}
      <div className="flex flex-col">
        <label htmlFor="min_price" className="text-sm font-medium text-gray-700 mb-1">
          Min Price
        </label>
        <input
          id="min_price"
          type="number"
          placeholder="$0"
          className="w-24 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          defaultValue={searchParams.get('min_price') || ''}
          onChange={(e) => handleFilterChange('min_price', e.target.value)}
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="max_price" className="text-sm font-medium text-gray-700 mb-1">
          Max Price
        </label>
        <input
          id="max_price"
          type="number"
          placeholder="$∞"
          className="w-24 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          defaultValue={searchParams.get('max_price') || ''}
          onChange={(e) => handleFilterChange('max_price', e.target.value)}
        />
      </div>

      {/* Clear Filters */}
      <div className="flex flex-col justify-end">
        <button
          onClick={() => {
            const params = new URLSearchParams();
            replace(`${pathname}?${params.toString()}`);
          }}
          className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
}

export { ProductFilters }; 