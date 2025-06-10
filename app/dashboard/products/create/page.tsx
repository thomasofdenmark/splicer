import { Metadata } from 'next';

import { fetchCategories } from '@/app/lib/product-data';
import Breadcrumbs from '@/app/ui/products/breadcrumbs';
import { ProductForm } from '@/app/ui/products/create-form';

export const metadata: Metadata = {
  title: 'Create Product | Splicer Dashboard',
  description: 'Create a new product for group buying deals.',
};

export default async function Page() {
  const categories = await fetchCategories();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Products', href: '/dashboard/products' },
          {
            label: 'Create Product',
            href: '/dashboard/products/create',
            active: true,
          },
        ]}
      />
      <ProductForm categories={categories} />
    </main>
  );
} 