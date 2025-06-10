'use client';

import { TrashIcon } from '@heroicons/react/24/outline';

import { deleteProduct } from '@/app/lib/product-actions';

export function DeleteProductButton({ id }: { id: string }) {
  async function handleDelete() {
    if (confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      await deleteProduct(id);
    }
  }

  return (
    <form action={handleDelete}>
      <button 
        type="submit"
        className="rounded-md border p-2 hover:bg-gray-100"
        title="Delete product"
      >
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5" />
      </button>
    </form>
  );
} 