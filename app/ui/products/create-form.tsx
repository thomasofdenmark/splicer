'use client';

import {
  ClockIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  PhotoIcon,
  TagIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useState, useActionState } from 'react';


import type { Category, ProductActionState } from '@/app/lib/group-buying-types';
import { createProduct } from '@/app/lib/product-actions';
import { Button } from '@/app/ui/button';

export function ProductForm({ categories }: { categories: Category[] }) {
  const initialState: ProductActionState = { message: null, errors: {} };
  const [state, dispatch] = useActionState(createProduct, initialState);
  
  const [imageUrls, setImageUrls] = useState<string[]>(['']);
  const [specifications, setSpecifications] = useState<Record<string, string>>({});
  const [newSpecKey, setNewSpecKey] = useState('');
  const [newSpecValue, setNewSpecValue] = useState('');

  const addImageUrl = () => {
    setImageUrls([...imageUrls, '']);
  };

  const updateImageUrl = (index: number, value: string) => {
    const newUrls = [...imageUrls];
    newUrls[index] = value;
    setImageUrls(newUrls);
  };

  const removeImageUrl = (index: number) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  const addSpecification = () => {
    if (newSpecKey && newSpecValue) {
      setSpecifications({
        ...specifications,
        [newSpecKey]: newSpecValue,
      });
      setNewSpecKey('');
      setNewSpecValue('');
    }
  };

  const removeSpecification = (key: string) => {
    const newSpecs = { ...specifications };
    delete newSpecs[key];
    setSpecifications(newSpecs);
  };

  return (
    <form action={dispatch}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Product Name */}
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Product Name
          </label>
          <div className="relative">
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter product name"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="name-error"
            />
            <TagIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          <div id="name-error" aria-live="polite" aria-atomic="true">
            {state.errors?.name &&
              state.errors.name.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Description */}
        <div className="mb-4">
          <label htmlFor="description" className="mb-2 block text-sm font-medium">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            placeholder="Enter product description"
            rows={4}
            className="peer block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
            aria-describedby="description-error"
          />
          <div id="description-error" aria-live="polite" aria-atomic="true">
            {state.errors?.description &&
              state.errors.description.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Category */}
        <div className="mb-4">
          <label htmlFor="category_id" className="mb-2 block text-sm font-medium">
            Category
          </label>
          <div className="relative">
            <select
              id="category_id"
              name="category_id"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue=""
              aria-describedby="category-error"
            >
              <option value="" disabled>
                Select a category
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <TagIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          <div id="category-error" aria-live="polite" aria-atomic="true">
            {state.errors?.category_id &&
              state.errors.category_id.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Price and Quantities */}
        <div className="mb-4 grid gap-4 md:grid-cols-3">
          {/* Base Price */}
          <div>
            <label htmlFor="base_price" className="mb-2 block text-sm font-medium">
              Base Price
            </label>
            <div className="relative">
              <input
                id="base_price"
                name="base_price"
                type="number"
                step="0.01"
                placeholder="0.00"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="price-error"
              />
              <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
          </div>

          {/* Minimum Quantity */}
          <div>
            <label htmlFor="minimum_quantity" className="mb-2 block text-sm font-medium">
              Min. Quantity
            </label>
            <div className="relative">
              <input
                id="minimum_quantity"
                name="minimum_quantity"
                type="number"
                min="1"
                placeholder="1"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="quantity-error"
              />
              <ClockIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
          </div>

          {/* Max Participants */}
          <div>
            <label htmlFor="max_participants" className="mb-2 block text-sm font-medium">
              Max Participants (Optional)
            </label>
            <div className="relative">
              <input
                id="max_participants"
                name="max_participants"
                type="number"
                min="1"
                placeholder="No limit"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
              <UserGroupIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
          </div>
        </div>

        {/* Error messages for price/quantity fields */}
        <div className="mb-4">
          {state.errors?.base_price &&
            state.errors.base_price.map((error: string) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                Price: {error}
              </p>
            ))}
          {state.errors?.minimum_quantity &&
            state.errors.minimum_quantity.map((error: string) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                Min. Quantity: {error}
              </p>
            ))}
          {state.errors?.max_participants &&
            state.errors.max_participants.map((error: string) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                Max Participants: {error}
              </p>
            ))}
        </div>

        {/* Image URLs */}
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium">
            Product Images
          </label>
          {imageUrls.map((url, index) => (
            <div key={index} className="mb-2 flex gap-2">
              <div className="relative flex-1">
                <input
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={url}
                  onChange={(e) => updateImageUrl(index, e.target.value)}
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                />
                <PhotoIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
              </div>
              {imageUrls.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeImageUrl(index)}
                  className="rounded-md bg-red-500 px-3 py-2 text-sm text-white hover:bg-red-600"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addImageUrl}
            className="mt-2 rounded-md bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600"
          >
            Add Image URL
          </button>
          <input
            type="hidden"
            name="image_urls"
            value={JSON.stringify(imageUrls.filter(url => url.trim()))}
          />
        </div>

        {/* Specifications */}
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium">
            Product Specifications
          </label>
          
          {/* Existing specifications */}
          {Object.entries(specifications).map(([key, value]) => (
            <div key={key} className="mb-2 flex gap-2 items-center">
              <span className="flex-1 rounded-md bg-gray-100 px-3 py-2 text-sm">
                <strong>{key}:</strong> {value}
              </span>
              <button
                type="button"
                onClick={() => removeSpecification(key)}
                className="rounded-md bg-red-500 px-3 py-2 text-sm text-white hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          ))}

          {/* Add new specification */}
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Specification name"
              value={newSpecKey}
              onChange={(e) => setNewSpecKey(e.target.value)}
              className="flex-1 rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
            />
            <input
              type="text"
              placeholder="Value"
              value={newSpecValue}
              onChange={(e) => setNewSpecValue(e.target.value)}
              className="flex-1 rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
            />
            <button
              type="button"
              onClick={addSpecification}
              className="rounded-md bg-green-500 px-4 py-2 text-sm text-white hover:bg-green-600"
            >
              Add
            </button>
          </div>
          
          <input
            type="hidden"
            name="specifications"
            value={JSON.stringify(specifications)}
          />
        </div>

        {/* Error message */}
        <div className="mb-4">
          {state.message && (
            <p className="mt-2 text-sm text-red-500">{state.message}</p>
          )}
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/products"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Create Product</Button>
      </div>
    </form>
  );
} 