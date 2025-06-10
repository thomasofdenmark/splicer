import { Metadata } from 'next';
import { Suspense } from 'react';

import { fetchProducts, fetchCategories } from '@/app/lib/product-data';
import { CreateProduct } from '@/app/ui/products/buttons';
import { ProductFilters } from '@/app/ui/products/filters';
import { Pagination } from '@/app/ui/products/pagination';
import { ProductsSearch } from '@/app/ui/products/search';
import { ProductsTableSkeleton } from '@/app/ui/products/skeletons';
import { ProductsTable } from '@/app/ui/products/table';

export const metadata: Metadata = {
  title: 'Products | Splicer Dashboard',
  description: 'Manage your product catalog for group buying deals.',
};

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
    category?: string;
    min_price?: string;
    max_price?: string;
  }>;
}) {
  const params = await searchParams;
  const query = params?.query || '';
  const currentPage = Number(params?.page) || 1;
  const categoryFilter = params?.category || '';
  const minPrice = params?.min_price ? Number(params.min_price) : undefined;
  const maxPrice = params?.max_price ? Number(params.max_price) : undefined;

  const filters = {
    category_id: categoryFilter || undefined,
    min_price: minPrice,
    max_price: maxPrice,
  };

  const [productsResult, categories] = await Promise.all([
    fetchProducts(filters, currentPage, 12),
    fetchCategories(),
  ]);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-bold">Products</h1>
      </div>
      
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <ProductsSearch placeholder="Search products..." />
        <CreateProduct />
      </div>
      
      <div className="mt-4">
        <ProductFilters categories={categories} />
      </div>

      <Suspense key={query + currentPage} fallback={<ProductsTableSkeleton />}>
        <ProductsTable products={productsResult.data} />
      </Suspense>

      <div className="mt-5 flex w-full justify-center">
        <Pagination pagination={productsResult.pagination} />
      </div>
    </div>
  );
} 