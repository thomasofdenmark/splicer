import Image from 'next/image';

import type { ProductWithCategory } from '@/app/lib/group-buying-types';
import { formatCurrency, formatDateToLocal } from '@/app/lib/utils';
import { UpdateProduct, ToggleProductStatus, ViewProduct } from '@/app/ui/products/buttons';
import { DeleteProductButton } from '@/app/ui/products/delete-button';

export default function ProductsTable({
  products,
}: {
  products: ProductWithCategory[];
}) {
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {products?.map((product) => (
              <div
                key={product.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center">
                    {product.image_urls?.[0] && (
                      <Image
                        src={product.image_urls[0]}
                        className="mr-2 rounded-full"
                        width={32}
                        height={32}
                        alt={`${product.name} product image`}
                      />
                    )}
                    <div>
                      <p className="text-sm font-medium">{product.name}</p>
                      <p className="text-sm text-gray-500">
                        {product.category_name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${
                        product.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {product.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p className="text-xl font-medium">
                      {formatCurrency(product.base_price)}
                    </p>
                    <p className="text-sm text-gray-500">
                      Min. qty: {product.minimum_quantity}
                    </p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <ViewProduct id={product.id} />
                    <UpdateProduct id={product.id} />
                    <DeleteProductButton id={product.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Product
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Category
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Price
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Min. Quantity
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Status
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Created
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {products?.map((product) => (
                <tr
                  key={product.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      {product.image_urls?.[0] && (
                        <Image
                          src={product.image_urls[0]}
                          className="rounded-lg"
                          width={48}
                          height={48}
                          alt={`${product.name} product image`}
                        />
                      )}
                      <div>
                        <p className="font-semibold">{product.name}</p>
                        <p className="text-gray-500 line-clamp-1">
                          {product.description}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                      {product.category_name}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatCurrency(product.base_price)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {product.minimum_quantity}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        product.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {product.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatDateToLocal(product.created_at)}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <ViewProduct id={product.id} />
                      <UpdateProduct id={product.id} />
                      <ToggleProductStatus 
                        id={product.id} 
                        isActive={product.is_active} 
                      />
                      <DeleteProductButton id={product.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export { ProductsTable }; 