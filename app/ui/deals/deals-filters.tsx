'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { Category } from '@/app/lib/group-buying-types';
import { useState } from 'react';

interface DealsFiltersProps {
  categories: Category[];
  selectedCategory?: string;
  minDiscount?: number;
  selectedStatus?: string;
}

export default function DealsFilters({
  categories,
  selectedCategory,
  minDiscount,
  selectedStatus,
}: DealsFiltersProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [localMinDiscount, setLocalMinDiscount] = useState(minDiscount?.toString() || '');

  const handleCategoryChange = (categoryId: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    
    if (categoryId && categoryId !== selectedCategory) {
      params.set('category', categoryId);
    } else {
      params.delete('category');
    }
    
    replace(`${pathname}?${params.toString()}`);
  };

  const handleStatusChange = (status: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    
    if (status && status !== selectedStatus) {
      params.set('status', status);
    } else {
      params.delete('status');
    }
    
    replace(`${pathname}?${params.toString()}`);
  };

  const handleDiscountFilter = () => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');

    if (localMinDiscount) {
      params.set('minDiscount', localMinDiscount);
    } else {
      params.delete('minDiscount');
    }

    replace(`${pathname}?${params.toString()}`);
  };

  const clearFilters = () => {
    const params = new URLSearchParams(searchParams);
    params.delete('category');
    params.delete('minDiscount');
    params.delete('status');
    setLocalMinDiscount('');
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      {/* Clear Filters */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Filters</h3>
        <button
          onClick={clearFilters}
          className="text-sm text-indigo-600 hover:text-indigo-500"
        >
          Clear all
        </button>
      </div>

      {/* Deal Status */}
      <div>
        <h4 className="text-base font-medium text-gray-900 mb-3">Deal Status</h4>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="radio"
              name="status"
              value=""
              checked={!selectedStatus}
              onChange={() => handleStatusChange('')}
              className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
            />
            <span className="ml-3 text-sm text-gray-600">All deals</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="status"
              value="pending"
              checked={selectedStatus === 'pending'}
              onChange={() => handleStatusChange('pending')}
              className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
            />
            <span className="ml-3 text-sm text-gray-600">Pending (need more people)</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="status"
              value="active"
              checked={selectedStatus === 'active'}
              onChange={() => handleStatusChange('active')}
              className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
            />
            <span className="ml-3 text-sm text-gray-600">Active (ready to purchase)</span>
          </label>
        </div>
      </div>

      {/* Categories */}
      <div>
        <h4 className="text-base font-medium text-gray-900 mb-3">Categories</h4>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="radio"
              name="category"
              value=""
              checked={!selectedCategory}
              onChange={() => handleCategoryChange('')}
              className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
            />
            <span className="ml-3 text-sm text-gray-600">All categories</span>
          </label>
          {categories.map((category) => (
            <label key={category.id} className="flex items-center">
              <input
                type="radio"
                name="category"
                value={category.id}
                checked={selectedCategory === category.id}
                onChange={() => handleCategoryChange(category.id)}
                className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
              />
              <span className="ml-3 text-sm text-gray-600">{category.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Minimum Discount */}
      <div>
        <h4 className="text-base font-medium text-gray-900 mb-3">Minimum Discount</h4>
        <div className="space-y-3">
          <div>
            <label htmlFor="minDiscount" className="block text-sm text-gray-600 mb-1">
              At least (%)
            </label>
            <input
              type="number"
              id="minDiscount"
              min="0"
              max="80"
              step="5"
              value={localMinDiscount}
              onChange={(e) => setLocalMinDiscount(e.target.value)}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="0"
            />
          </div>
          <button
            onClick={handleDiscountFilter}
            className="w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Apply Discount Filter
          </button>
        </div>
      </div>

      {/* Quick Filters */}
      <div>
        <h4 className="text-base font-medium text-gray-900 mb-3">Quick Filters</h4>
        <div className="space-y-2">
          <button 
            onClick={() => {
              const params = new URLSearchParams(searchParams);
              params.set('sort', 'ending_soon');
              params.set('page', '1');
              replace(`${pathname}?${params.toString()}`);
            }}
            className="w-full text-left text-sm text-gray-600 hover:text-indigo-600 py-1"
          >
            🔥 Ending in 24 hours
          </button>
          <button 
            onClick={() => {
              const params = new URLSearchParams(searchParams);
              params.set('sort', 'popular');
              params.set('page', '1');
              replace(`${pathname}?${params.toString()}`);
            }}
            className="w-full text-left text-sm text-gray-600 hover:text-indigo-600 py-1"
          >
            ⚡ Almost full (90%+)
          </button>
          <button 
            onClick={() => {
              const params = new URLSearchParams(searchParams);
              params.set('minDiscount', '50');
              params.set('page', '1');
              setLocalMinDiscount('50');
              replace(`${pathname}?${params.toString()}`);
            }}
            className="w-full text-left text-sm text-gray-600 hover:text-indigo-600 py-1"
          >
            💰 High discounts (50%+)
          </button>
          <button 
            onClick={() => {
              const params = new URLSearchParams(searchParams);
              params.set('sort', 'newest');
              params.set('page', '1');
              replace(`${pathname}?${params.toString()}`);
            }}
            className="w-full text-left text-sm text-gray-600 hover:text-indigo-600 py-1"
          >
            🆕 Started today
          </button>
        </div>
      </div>
    </div>
  );
} 