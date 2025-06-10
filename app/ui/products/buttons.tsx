import { PlusIcon, PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

import { deleteProduct, toggleProductStatus } from '@/app/lib/product-actions';

export function CreateProduct() {
  return (
    <Link
      href="/dashboard/products/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Create Product</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateProduct({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/products/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function ViewProduct({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/products/${id}`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <EyeIcon className="w-5" />
    </Link>
  );
}

export function DeleteProduct({ id }: { id: string }) {
  async function handleDelete() {
    'use server';
    await deleteProduct(id);
  }

  return (
    <form action={handleDelete}>
      <button 
        type="submit"
        className="rounded-md border p-2 hover:bg-gray-100"
      >
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5" />
      </button>
    </form>
  );
}

export function ToggleProductStatus({ 
  id, 
  isActive 
}: { 
  id: string; 
  isActive: boolean; 
}) {
  async function handleToggle() {
    'use server';
    await toggleProductStatus(id);
  }

  return (
    <form action={handleToggle}>
      <button 
        type="submit"
        className={`rounded-md border p-2 hover:bg-gray-100 ${
          isActive ? 'text-green-600' : 'text-gray-400'
        }`}
        title={isActive ? 'Deactivate product' : 'Activate product'}
      >
        <span className="sr-only">
          {isActive ? 'Deactivate' : 'Activate'}
        </span>
        <div className={`w-3 h-3 rounded-full ${
          isActive ? 'bg-green-500' : 'bg-gray-300'
        }`} />
      </button>
    </form>
  );
} 