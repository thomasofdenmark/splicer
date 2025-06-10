import Image from 'next/image';
import Link from 'next/link';

import { Product } from '@/app/lib/group-buying-types';
import { formatCurrency } from '@/app/lib/utils';

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto max-w-md">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No products found</h3>
          <p className="mt-2 text-gray-500">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  // For now, we'll use base_price since discount logic will come from group deals
  const basePrice = product.base_price;

  return (
    <Link
      href={`/products/${product.id}`}
      className="group relative bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
    >
      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-t-lg bg-gray-200">
        <Image
          src={product.image_urls[0] || 'https://picsum.photos/400/300'}
          alt={product.name}
          width={400}
          height={300}
          className="h-full w-full object-cover object-center group-hover:opacity-75 transition-opacity"
        />
        {!product.is_active && (
          <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-semibold">Out of Stock</span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="mb-2">
          <h3 className="text-lg font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-gray-500 line-clamp-2 mt-1">
            {product.description}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-semibold text-gray-900">
              {formatCurrency(basePrice)}
            </span>
          </div>
          
          <div className="flex items-center text-sm text-gray-500">
            <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {product.is_active ? 'Available' : 'Out of stock'}
          </div>
        </div>

        {/* Group Deal Indicator */}
        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="text-indigo-600 font-medium">
            🎯 Group deals available
          </span>
          <span className="text-gray-500">
            Starting from 5 people
          </span>
        </div>
      </div>
    </Link>
  );
} 