// Loading animation
const shimmer =
  'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent';

export function ProductsTableSkeleton() {
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
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
              <ProductRowSkeleton />
              <ProductRowSkeleton />
              <ProductRowSkeleton />
              <ProductRowSkeleton />
              <ProductRowSkeleton />
              <ProductRowSkeleton />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function ProductRowSkeleton() {
  return (
    <tr className="w-full border-b border-gray-100 last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg">
      {/* Product */}
      <td className="relative overflow-hidden whitespace-nowrap py-3 pl-6 pr-3">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-lg bg-gray-100"></div>
          <div className="h-6 w-32 rounded bg-gray-100"></div>
        </div>
        <div className={`${shimmer} relative overflow-hidden`}></div>
      </td>
      {/* Category */}
      <td className="relative overflow-hidden whitespace-nowrap px-3 py-3">
        <div className="h-6 w-20 rounded bg-gray-100"></div>
        <div className={`${shimmer} relative overflow-hidden`}></div>
      </td>
      {/* Price */}
      <td className="relative overflow-hidden whitespace-nowrap px-3 py-3">
        <div className="h-6 w-16 rounded bg-gray-100"></div>
        <div className={`${shimmer} relative overflow-hidden`}></div>
      </td>
      {/* Min Quantity */}
      <td className="relative overflow-hidden whitespace-nowrap px-3 py-3">
        <div className="h-6 w-8 rounded bg-gray-100"></div>
        <div className={`${shimmer} relative overflow-hidden`}></div>
      </td>
      {/* Status */}
      <td className="relative overflow-hidden whitespace-nowrap px-3 py-3">
        <div className="h-6 w-16 rounded bg-gray-100"></div>
        <div className={`${shimmer} relative overflow-hidden`}></div>
      </td>
      {/* Created */}
      <td className="relative overflow-hidden whitespace-nowrap px-3 py-3">
        <div className="h-6 w-24 rounded bg-gray-100"></div>
        <div className={`${shimmer} relative overflow-hidden`}></div>
      </td>
      {/* Actions */}
      <td className="relative overflow-hidden whitespace-nowrap py-3 pl-6 pr-3">
        <div className="flex justify-end gap-3">
          <div className="h-[38px] w-[38px] rounded bg-gray-100"></div>
          <div className="h-[38px] w-[38px] rounded bg-gray-100"></div>
          <div className="h-[38px] w-[38px] rounded bg-gray-100"></div>
        </div>
        <div className={`${shimmer} relative overflow-hidden`}></div>
      </td>
    </tr>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="mb-2 w-full rounded-md bg-white p-4">
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div className="flex items-center">
          <div className="mr-2 h-8 w-8 rounded-full bg-gray-100"></div>
          <div className="h-6 w-16 rounded bg-gray-100"></div>
        </div>
        <div className="h-6 w-16 rounded bg-gray-100"></div>
      </div>
      <div className="flex w-full items-center justify-between pt-4">
        <div className="h-6 w-16 rounded bg-gray-100"></div>
        <div className="flex justify-end gap-2">
          <div className="h-10 w-10 rounded bg-gray-100"></div>
          <div className="h-10 w-10 rounded bg-gray-100"></div>
          <div className="h-10 w-10 rounded bg-gray-100"></div>
        </div>
      </div>
      <div className={`${shimmer} relative overflow-hidden`}></div>
    </div>
  );
} 