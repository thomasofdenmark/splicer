'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useActionState, useState, useEffect } from 'react';

import { createGroupDeal } from '@/app/lib/deal-actions';
import { ProductWithCategory } from '@/app/lib/group-buying-types';
import { Button } from '@/app/ui/button';

export default function Form({ products }: { products: ProductWithCategory[] }) {
  const initialState = { message: '', errors: {} };
  const [state, dispatch] = useActionState(createGroupDeal, initialState);
  const [selectedProduct, setSelectedProduct] = useState<ProductWithCategory | null>(null);
  const router = useRouter();

  // Handle redirect when deal is created successfully
  useEffect(() => {
    if (state.dealId && !state.errors) {
      router.push(`/deals/${state.dealId}`);
    }
  }, [state.dealId, state.errors, router]);

  // Find selected product details
  const handleProductChange = (productId: string) => {
    const product = products.find(p => p.id === productId);
    setSelectedProduct(product || null);
  };

  return (
    <form action={dispatch}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6 md:w-1/2">
        {/* Product Selection */}
        <div className="mb-4">
          <label htmlFor="product_id" className="mb-2 block text-sm font-medium">
            Choose product
          </label>
          <div className="relative">
            <select
              id="product_id"
              name="product_id"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
              defaultValue=""
              onChange={(e) => handleProductChange(e.target.value)}
              aria-describedby="product-error"
            >
              <option value="" disabled>
                Select a product
              </option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} - ${product.base_price} ({product.category_name})
                </option>
              ))}
            </select>
          </div>
          <div id="product-error" aria-live="polite" aria-atomic="true">
            {state.errors?.product_id &&
              state.errors.product_id.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Deal Title */}
        <div className="mb-4">
          <label htmlFor="title" className="mb-2 block text-sm font-medium">
            Deal Title
          </label>
          <div className="relative">
            <input
              id="title"
              name="title"
              type="text"
              placeholder="Enter deal title"
              className=" block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="title-error"
            />
          </div>
          <div id="title-error" aria-live="polite" aria-atomic="true">
            {state.errors?.title &&
              state.errors.title.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Description */}
        <div className="mb-4">
          <label htmlFor="description" className="mb-2 block text-sm font-medium">
            Description (optional)
          </label>
          <div className="relative">
            <textarea
              id="description"
              name="description"
              placeholder="Describe your group deal..."
              rows={3}
              className="peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="description-error"
            />
          </div>
          <div id="description-error" aria-live="polite" aria-atomic="true">
            {state.errors?.description &&
              state.errors.description.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Target Participants */}
        <div className="mb-4">
          <label htmlFor="target_participants" className="mb-2 block text-sm font-medium">
            Target Participants
          </label>
          <div className="relative">
            <input
              id="target_participants"
              name="target_participants"
              type="number"
              min="2"
              max="1000"
              placeholder="How many people needed?"
              className="peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="target_participants-error"
            />
          </div>
          <div id="target_participants-error" aria-live="polite" aria-atomic="true">
            {state.errors?.target_participants &&
              state.errors.target_participants.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Target Quantity */}
        <div className="mb-4">
          <label htmlFor="target_quantity" className="mb-2 block text-sm font-medium">
            Target Quantity (optional)
          </label>
          <div className="relative">
            <input
              id="target_quantity"
              name="target_quantity"
              type="number"
              min="1"
              placeholder="Total items to order (leave empty to equal participants)"
              className="peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="target_quantity-error"
            />
          </div>
          <div id="target_quantity-error" aria-live="polite" aria-atomic="true">
            {state.errors?.target_quantity &&
              state.errors.target_quantity.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Discount Percentage */}
        <div className="mb-4">
          <label htmlFor="discount_percentage" className="mb-2 block text-sm font-medium">
            Discount Percentage
          </label>
          <div className="relative">
            <input
              id="discount_percentage"
              name="discount_percentage"
              type="number"
              min="1"
              max="80"
              step="0.1"
              placeholder="Discount % (1-80)"
              className="peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="discount_percentage-error"
            />
          </div>
          {selectedProduct && (
            <p className="mt-1 text-xs text-gray-600">
              Original price: ${selectedProduct.base_price}
            </p>
          )}
          <div id="discount_percentage-error" aria-live="polite" aria-atomic="true">
            {state.errors?.discount_percentage &&
              state.errors.discount_percentage.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Duration */}
        <div className="mb-4">
          <label htmlFor="duration_hours" className="mb-2 block text-sm font-medium">
            Duration (hours)
          </label>
          <div className="relative">
            <select
              id="duration_hours"
              name="duration_hours"
              className="peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2"
              defaultValue="168"
              aria-describedby="duration_hours-error"
            >
              <option value="24">24 hours (1 day)</option>
              <option value="48">48 hours (2 days)</option>
              <option value="72">72 hours (3 days)</option>
              <option value="168">168 hours (1 week)</option>
              <option value="336">336 hours (2 weeks)</option>
              <option value="720">720 hours (30 days)</option>
            </select>
          </div>
          <div id="duration_hours-error" aria-live="polite" aria-atomic="true">
            {state.errors?.duration_hours &&
              state.errors.duration_hours.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        <div id="form-error" aria-live="polite" aria-atomic="true">
          {state.message && (
            <div className={`mt-2 text-sm ${
              state.errors && Object.keys(state.errors).length > 0 
                ? 'text-red-500' 
                : 'text-green-600'
            }`}>
              {state.message}
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-6 flex justify-end gap-4 md:w-1/2">
        <Link
          href="/deals"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Create Deal</Button>
      </div>
    </form>
  );
} 