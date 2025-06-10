import Form from '@/app/ui/deals/create-form';
import Breadcrumbs from '@/app/ui/breadcrumbs';
import { fetchAllProducts } from '@/app/lib/product-data';

export default async function Page() {
  const products = await fetchAllProducts();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Deals', href: '/deals' },
          {
            label: 'Create Deal',
            href: '/dashboard/deals/create',
            active: true,
          },
        ]}
      />
      <Form products={products} />
    </main>
  );
} 