import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { fetchProductById } from '@/app/lib/product-data';
import { formatCurrency } from '@/app/lib/utils';
import { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await fetchProductById(id);
  
  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  return {
    title: `${product.name} | Group Buying Platform`,
    description: product.description,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await fetchProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <div className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/products"
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
          >
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back to Products
          </Link>
        </div>
      </div>

      {/* Product Details */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
          {/* Product Images */}
          <div className="flex flex-col">
            <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200">
              <Image
                src={product.image_urls[0] || 'https://picsum.photos/600/600'}
                alt={product.name}
                width={600}
                height={600}
                className="h-full w-full object-cover object-center"
              />
            </div>
            
            {/* Additional Images */}
            {product.image_urls.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-2">
                {product.image_urls.slice(1, 5).map((url, index) => (
                  <div key={index} className="aspect-h-1 aspect-w-1 overflow-hidden rounded-md bg-gray-200">
                    <Image
                      src={url}
                      alt={`${product.name} ${index + 2}`}
                      width={150}
                      height={150}
                      className="h-full w-full object-cover object-center hover:opacity-75 cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">{product.name}</h1>
            
            <div className="mt-3">
              <h2 className="sr-only">Product information</h2>
              <p className="text-3xl tracking-tight text-gray-900">
                {formatCurrency(product.base_price)}
              </p>
            </div>

            {/* Category */}
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-900">Category</h3>
              <p className="mt-1 text-sm text-gray-600">{product.category_name}</p>
            </div>

            {/* Description */}
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-900">Description</h3>
              <div className="mt-4 space-y-6">
                <p className="text-base text-gray-900">{product.description}</p>
              </div>
            </div>

            {/* Group Deal Section */}
            <div className="mt-8 rounded-lg bg-indigo-50 p-6">
              <h3 className="text-lg font-medium text-indigo-900">Group Deal Information</h3>
              <div className="mt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-indigo-700">Minimum group size:</span>
                  <span className="font-medium text-indigo-900">{product.minimum_quantity} people</span>
                </div>
                {product.max_participants && (
                  <div className="flex justify-between text-sm">
                    <span className="text-indigo-700">Maximum participants:</span>
                    <span className="font-medium text-indigo-900">{product.max_participants} people</span>
                  </div>
                )}
                <div className="mt-4 p-3 bg-white rounded-md border border-indigo-200">
                  <p className="text-sm text-indigo-700">
                    💡 <strong>How it works:</strong> Join or start a group deal to get better prices when buying with others!
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
              <button
                type="button"
                className="flex-1 rounded-md bg-indigo-600 px-8 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Start New Group Deal
              </button>
            </div>

            {/* Specifications */}
            {/* {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div className="mt-10">
                <h3 className="text-sm font-medium text-gray-900">Specifications</h3>
                <div className="mt-4">
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key}>
                        <dt className="text-sm font-medium text-gray-500 capitalize">
                          {key.replace(/_/g, ' ')}
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
} 