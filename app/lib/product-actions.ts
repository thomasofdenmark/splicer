'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import postgres from 'postgres';
import { z } from 'zod';

import { auth } from '@/auth';

import type { 
  ProductActionState,
  CategoryActionState
} from './group-buying-types';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// Validation schemas
const ProductSchema = z.object({
  id: z.string(),
  name: z.string({
    invalid_type_error: 'Please enter a product name.',
  }).min(1, 'Product name is required.').max(255, 'Product name is too long.'),
  description: z.string({
    invalid_type_error: 'Please enter a product description.',
  }).min(10, 'Description must be at least 10 characters.'),
  category_id: z.string({
    invalid_type_error: 'Please select a category.',
  }).uuid('Please select a valid category.'),
  base_price: z.coerce
    .number()
    .gt(0, { message: 'Please enter a price greater than $0.' }),
  minimum_quantity: z.coerce
    .number()
    .int()
    .min(1, { message: 'Minimum quantity must be at least 1.' }),
  max_participants: z.coerce
    .number()
    .int()
    .min(1, { message: 'Max participants must be at least 1.' })
    .optional()
    .nullable(),
  image_urls: z.array(z.string().url('Please enter valid image URLs.')).default([]),
  specifications: z.record(z.string()).default({}),
});

const CategorySchema = z.object({
  id: z.string(),
  name: z.string({
    invalid_type_error: 'Please enter a category name.',
  }).min(1, 'Category name is required.').max(255, 'Category name is too long.'),
  description: z.string().optional(),
  image_url: z.string().url('Please enter a valid image URL.').optional().or(z.literal('')),
});

const CreateProduct = ProductSchema.omit({ id: true });
const UpdateProduct = ProductSchema.omit({ id: true });
const CreateCategory = CategorySchema.omit({ id: true });
const UpdateCategory = CategorySchema.omit({ id: true });

// Product actions
export async function createProduct(
  prevState: ProductActionState,
  formData: FormData,
): Promise<ProductActionState> {
  const session = await auth();
  
  if (!session?.user?.id) {
    return {
      errors: {},
      message: 'You must be logged in to create products.',
    };
  }

  // Validate form fields
  const validatedFields = CreateProduct.safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
    category_id: formData.get('category_id'),
    base_price: formData.get('base_price'),
    minimum_quantity: formData.get('minimum_quantity'),
    max_participants: formData.get('max_participants') || null,
    image_urls: JSON.parse(formData.get('image_urls') as string || '[]'),
    specifications: JSON.parse(formData.get('specifications') as string || '{}'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Product.',
    };
  }

  const { 
    name, 
    description, 
    category_id, 
    base_price, 
    minimum_quantity, 
    max_participants,
    image_urls,
    specifications
  } = validatedFields.data;

  try {
    await sql`
      INSERT INTO products (
        name, 
        description, 
        category_id, 
        base_price, 
        minimum_quantity, 
        max_participants,
        image_urls,
        specifications,
        created_by
      )
      VALUES (
        ${name}, 
        ${description}, 
        ${category_id}, 
        ${base_price}, 
        ${minimum_quantity}, 
        ${max_participants ?? null},
        ${image_urls},
        ${JSON.stringify(specifications)},
        ${session.user.id}
      );
    `;
  } catch (error) {
    console.error('Database Error:', error);
    return {
      message: 'Database Error: Failed to Create Product.',
    };
  }

  revalidatePath('/dashboard/products');
  redirect('/dashboard/products');
}

export async function updateProduct(
  id: string,
  prevState: ProductActionState,
  formData: FormData,
): Promise<ProductActionState> {
  const session = await auth();
  
  if (!session?.user?.id) {
    return {
      errors: {},
      message: 'You must be logged in to update products.',
    };
  }

  const validatedFields = UpdateProduct.safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
    category_id: formData.get('category_id'),
    base_price: formData.get('base_price'),
    minimum_quantity: formData.get('minimum_quantity'),
    max_participants: formData.get('max_participants') || null,
    image_urls: JSON.parse(formData.get('image_urls') as string || '[]'),
    specifications: JSON.parse(formData.get('specifications') as string || '{}'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Product.',
    };
  }

  const { 
    name, 
    description, 
    category_id, 
    base_price, 
    minimum_quantity, 
    max_participants,
    image_urls,
    specifications
  } = validatedFields.data;

  try {
    await sql`
      UPDATE products
      SET 
        name = ${name}, 
        description = ${description}, 
        category_id = ${category_id}, 
        base_price = ${base_price}, 
        minimum_quantity = ${minimum_quantity}, 
        max_participants = ${max_participants ?? null},
        image_urls = ${image_urls},
        specifications = ${JSON.stringify(specifications)},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id};
    `;
  } catch (error) {
    console.error('Database Error:', error);
    return {
      message: 'Database Error: Failed to Update Product.',
    };
  }

  revalidatePath('/dashboard/products');
  redirect('/dashboard/products');
}

export async function deleteProduct(id: string): Promise<{ message?: string }> {
  const session = await auth();
  
  if (!session?.user?.id) {
    return { message: 'You must be logged in to delete products.' };
  }

  try {
    await sql`DELETE FROM products WHERE id = ${id};`;
    revalidatePath('/dashboard/products');
    return { message: 'Product deleted successfully.' };
  } catch (error) {
    console.error('Database Error:', error);
    return { message: 'Database Error: Failed to Delete Product.' };
  }
}

export async function toggleProductStatus(id: string): Promise<{ message?: string }> {
  const session = await auth();
  
  if (!session?.user?.id) {
    return { message: 'You must be logged in to update products.' };
  }

  try {
    await sql`
      UPDATE products 
      SET is_active = NOT is_active, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id};
    `;
    revalidatePath('/dashboard/products');
    return { message: 'Product status updated successfully.' };
  } catch (error) {
    console.error('Database Error:', error);
    return { message: 'Database Error: Failed to Update Product Status.' };
  }
}

// Category actions
export async function createCategory(
  prevState: CategoryActionState,
  formData: FormData,
): Promise<CategoryActionState> {
  const session = await auth();
  
  if (!session?.user?.id) {
    return {
      errors: {},
      message: 'You must be logged in to create categories.',
    };
  }

  const validatedFields = CreateCategory.safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
    image_url: formData.get('image_url'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Category.',
    };
  }

  const { name, description, image_url } = validatedFields.data;

  try {
    await sql`
      INSERT INTO categories (name, description, image_url)
      VALUES (${name}, ${description ?? null}, ${image_url ?? null});
    `;
  } catch (error) {
    console.error('Database Error:', error);
    return {
      message: 'Database Error: Failed to Create Category.',
    };
  }

  revalidatePath('/dashboard/categories');
  redirect('/dashboard/categories');
}

export async function updateCategory(
  id: string,
  prevState: CategoryActionState,
  formData: FormData,
): Promise<CategoryActionState> {
  const session = await auth();
  
  if (!session?.user?.id) {
    return {
      errors: {},
      message: 'You must be logged in to update categories.',
    };
  }

  const validatedFields = UpdateCategory.safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
    image_url: formData.get('image_url'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Category.',
    };
  }

  const { name, description, image_url } = validatedFields.data;

  try {
    await sql`
      UPDATE categories
      SET 
        name = ${name}, 
        description = ${description ?? null}, 
        image_url = ${image_url ?? null},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id};
    `;
  } catch (error) {
    console.error('Database Error:', error);
    return {
      message: 'Database Error: Failed to Update Category.',
    };
  }

  revalidatePath('/dashboard/categories');
  redirect('/dashboard/categories');
}

export async function deleteCategory(id: string): Promise<{ message?: string }> {
  const session = await auth();
  
  if (!session?.user?.id) {
    return { message: 'You must be logged in to delete categories.' };
  }

  try {
    // Check if category has products
    const products = await sql`
      SELECT COUNT(*) as count FROM products WHERE category_id = ${id};
    `;
    
    if (parseInt(products[0].count) > 0) {
      return { 
        message: 'Cannot delete category with products. Move or delete products first.' 
      };
    }

    await sql`DELETE FROM categories WHERE id = ${id};`;
    revalidatePath('/dashboard/categories');
    return { message: 'Category deleted successfully.' };
  } catch (error) {
    console.error('Database Error:', error);
    return { message: 'Database Error: Failed to Delete Category.' };
  }
}

export async function toggleCategoryStatus(id: string): Promise<{ message?: string }> {
  const session = await auth();
  
  if (!session?.user?.id) {
    return { message: 'You must be logged in to update categories.' };
  }

  try {
    await sql`
      UPDATE categories 
      SET is_active = NOT is_active, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id};
    `;
    revalidatePath('/dashboard/categories');
    return { message: 'Category status updated successfully.' };
  } catch (error) {
    console.error('Database Error:', error);
    return { message: 'Database Error: Failed to Update Category Status.' };
  }
} 