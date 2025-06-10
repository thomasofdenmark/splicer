import { Suspense } from 'react';
import { fetchFilteredProducts, fetchCategories } from '@/app/lib/product-data';
import ProductGrid from '@/app/ui/catalog/product-grid';
import ProductGridSkeleton from '@/app/ui/catalog/product-grid-skeleton';
import CatalogFilters from '@/app/ui/catalog/catalog-filters';
import CatalogSearch from '@/app/ui/catalog/catalog-search';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Products | Group Buying Platform',
  description: 'Browse our product catalog and join group deals for better prices.',
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{
    query?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    page?: string;
  }>;
}) {
  const params = await searchParams;
  const query = params?.query || '';
  const category = params?.category || '';
  const minPrice = params?.minPrice ? parseFloat(params.minPrice) : undefined;
  const maxPrice = params?.maxPrice ? parseFloat(params.maxPrice) : undefined;
  const currentPage = Number(params?.page) || 1;

  // Fetch data in parallel
  const [products, categories] = await Promise.all([
    fetchFilteredProducts(query, category, minPrice, maxPrice, currentPage),
    fetchCategories(),
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Filters Sidebar */}
          <div className="hidden lg:block">
            <div className="sticky top-8">
              <CatalogFilters 
                categories={categories}
                selectedCategory={category}
                minPrice={minPrice}
                maxPrice={maxPrice}
              />
            </div>
          </div>

          {/* Products */}
          <div className="mt-6 lg:col-span-3 lg:mt-0">
            {/* Search */}
            <div className="mb-6">
              <CatalogSearch placeholder="Search products..." />
            </div>

            {/* Mobile Filters Toggle */}
            <div className="mb-6 lg:hidden">
              <button
                type="button"
                className="flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
              >
                Filters
              </button>
            </div>

            {/* Product Grid */}
            <Suspense fallback={<ProductGridSkeleton />}>
              <ProductGrid products={products} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
} 