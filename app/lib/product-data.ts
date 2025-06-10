import { unstable_noStore as noStore } from 'next/cache';
import postgres from 'postgres';

import type { 
  Category, 
  ProductWithCategory,
  ProductFilters,
  PaginatedResponse 
} from './group-buying-types';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// Category functions
export async function fetchCategories(): Promise<Category[]> {
  noStore();
  
  try {
    const categories = await sql<Category[]>`
      SELECT id, name, description, image_url, is_active, created_at, updated_at
      FROM categories 
      WHERE is_active = true
      ORDER BY name ASC;
    `;
    
    return categories;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch categories.');
  }
}

export async function fetchCategoryById(id: string): Promise<Category | null> {
  noStore();
  
  try {
    const category = await sql<Category[]>`
      SELECT id, name, description, image_url, is_active, created_at, updated_at
      FROM categories 
      WHERE id = ${id};
    `;
    
    return category[0] || null;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch category.');
  }
}

// Product functions
export async function fetchProducts(
  filters: ProductFilters = {},
  page: number = 1,
  limit: number = 12
): Promise<PaginatedResponse<ProductWithCategory>> {
  noStore();
  
  try {
    const offset = (page - 1) * limit;
    
    // Build WHERE clause based on filters
    const whereConditions = ['p.is_active = true'];
    const values: (string | number)[] = [];
    let paramCount = 0;
    
    if (filters.category_id) {
      paramCount++;
      whereConditions.push(`p.category_id = $${paramCount}`);
      values.push(filters.category_id);
    }
    
    if (filters.min_price) {
      paramCount++;
      whereConditions.push(`p.base_price >= $${paramCount}`);
      values.push(filters.min_price);
    }
    
    if (filters.max_price) {
      paramCount++;
      whereConditions.push(`p.base_price <= $${paramCount}`);
      values.push(filters.max_price);
    }
    
    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
    
    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM products p
      JOIN categories c ON p.category_id = c.id
      ${whereClause};
    `;
    
    const totalResult = await sql.unsafe(countQuery, values);
    const total = parseInt(totalResult[0].total);
    
    // Get products with pagination
    const productsQuery = `
      SELECT 
        p.id,
        p.name,
        p.description,
        p.category_id,
        p.base_price,
        p.minimum_quantity,
        p.max_participants,
        p.image_urls,
        p.specifications,
        p.is_active,
        p.created_by,
        p.created_at,
        p.updated_at,
        c.name as category_name,
        c.description as category_description
      FROM products p
      JOIN categories c ON p.category_id = c.id
      ${whereClause}
      ORDER BY p.created_at DESC
      LIMIT $${paramCount + 1} OFFSET $${paramCount + 2};
    `;
    
    const products = await sql.unsafe(productsQuery, [...values, limit, offset]) as ProductWithCategory[];
    
    const totalPages = Math.ceil(total / limit);
    
    return {
      data: products,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch products.');
  }
}

export async function fetchProductById(id: string): Promise<ProductWithCategory | null> {
  noStore();
  
  try {
    const products = await sql<ProductWithCategory[]>`
      SELECT 
        p.id,
        p.name,
        p.description,
        p.category_id,
        p.base_price,
        p.minimum_quantity,
        p.max_participants,
        p.image_urls,
        p.specifications,
        p.is_active,
        p.created_by,
        p.created_at,
        p.updated_at,
        c.name as category_name,
        c.description as category_description
      FROM products p
      JOIN categories c ON p.category_id = c.id
      WHERE p.id = ${id};
    `;
    
    return products[0] || null;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch product.');
  }
}

export async function fetchProductsByCategory(
  categoryId: string,
  limit: number = 6
): Promise<ProductWithCategory[]> {
  noStore();
  
  try {
    const products = await sql<ProductWithCategory[]>`
      SELECT 
        p.id,
        p.name,
        p.description,
        p.category_id,
        p.base_price,
        p.minimum_quantity,
        p.max_participants,
        p.image_urls,
        p.specifications,
        p.is_active,
        p.created_by,
        p.created_at,
        p.updated_at,
        c.name as category_name,
        c.description as category_description
      FROM products p
      JOIN categories c ON p.category_id = c.id
      WHERE p.category_id = ${categoryId} AND p.is_active = true
      ORDER BY p.created_at DESC
      LIMIT ${limit};
    `;
    
    return products;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch products by category.');
  }
}

export async function searchProducts(
  query: string,
  limit: number = 10
): Promise<ProductWithCategory[]> {
  noStore();
  
  try {
    const products = await sql<ProductWithCategory[]>`
      SELECT 
        p.id,
        p.name,
        p.description,
        p.category_id,
        p.base_price,
        p.minimum_quantity,
        p.max_participants,
        p.image_urls,
        p.specifications,
        p.is_active,
        p.created_by,
        p.created_at,
        p.updated_at,
        c.name as category_name,
        c.description as category_description
      FROM products p
      JOIN categories c ON p.category_id = c.id
      WHERE p.is_active = true 
        AND (
          p.name ILIKE ${`%${query}%`} OR 
          p.description ILIKE ${`%${query}%`} OR
          c.name ILIKE ${`%${query}%`}
        )
      ORDER BY p.created_at DESC
      LIMIT ${limit};
    `;
    
    return products;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to search products.');
  }
}

// Product statistics
export async function fetchProductStats() {
  noStore();
  
  try {
    const stats = await sql`
      SELECT 
        COUNT(*) as total_products,
        COUNT(CASE WHEN is_active = true THEN 1 END) as active_products,
        AVG(base_price) as avg_price,
        MIN(base_price) as min_price,
        MAX(base_price) as max_price
      FROM products;
    `;
    
    const categoryStats = await sql`
      SELECT 
        c.id,
        c.name,
        COUNT(p.id) as product_count
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id AND p.is_active = true
      WHERE c.is_active = true
      GROUP BY c.id, c.name
      ORDER BY product_count DESC;
    `;
    
    return {
      overview: stats[0],
      categories: categoryStats,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch product statistics.');
  }
}

// Featured products (for homepage)
// Simplified function for the catalog page
export async function fetchFilteredProducts(
  query: string = '',
  categoryId: string = '',
  minPrice?: number,
  maxPrice?: number,
  page: number = 1,
  limit: number = 12
): Promise<ProductWithCategory[]> {
  noStore();
  
  try {
    const offset = (page - 1) * limit;
    
    // Build WHERE clause
    const whereConditions = ['p.is_active = true', 'c.is_active = true'];
    const values: (string | number)[] = [];
    let paramCount = 0;
    
    if (query) {
      paramCount++;
      whereConditions.push(`(p.name ILIKE $${paramCount} OR p.description ILIKE $${paramCount})`);
      values.push(`%${query}%`);
    }
    
    if (categoryId) {
      paramCount++;
      whereConditions.push(`p.category_id = $${paramCount}`);
      values.push(categoryId);
    }
    
    if (minPrice) {
      paramCount++;
      whereConditions.push(`p.base_price >= $${paramCount}`);
      values.push(minPrice);
    }
    
    if (maxPrice) {
      paramCount++;
      whereConditions.push(`p.base_price <= $${paramCount}`);
      values.push(maxPrice);
    }
    
    const whereClause = whereConditions.join(' AND ');
    
    const productsQuery = `
      SELECT 
        p.id,
        p.name,
        p.description,
        p.category_id,
        p.base_price,
        p.minimum_quantity,
        p.max_participants,
        p.image_urls,
        p.specifications,
        p.is_active,
        p.created_by,
        p.created_at,
        p.updated_at,
        c.name as category_name,
        c.description as category_description
      FROM products p
      JOIN categories c ON p.category_id = c.id
      WHERE ${whereClause}
      ORDER BY p.created_at DESC
      LIMIT $${paramCount + 1} OFFSET $${paramCount + 2};
    `;
    
    const products = await sql.unsafe(productsQuery, [...values, limit, offset]) as ProductWithCategory[];
    return products;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch filtered products.');
  }
}

export async function fetchFeaturedProducts(limit: number = 8): Promise<ProductWithCategory[]> {
  noStore();
  
  try {
    const products = await sql<ProductWithCategory[]>`
      SELECT 
        p.id,
        p.name,
        p.description,
        p.category_id,
        p.base_price,
        p.minimum_quantity,
        p.max_participants,
        p.image_urls,
        p.specifications,
        p.is_active,
        p.created_by,
        p.created_at,
        p.updated_at,
        c.name as category_name,
        c.description as category_description
      FROM products p
      JOIN categories c ON p.category_id = c.id
      WHERE p.is_active = true
      ORDER BY p.created_at DESC
      LIMIT ${limit};
    `;
    
    return products;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch featured products.');
  }
}

// Simple function to get all active products (for forms/selects)
export async function fetchAllProducts(): Promise<ProductWithCategory[]> {
  noStore();
  
  try {
    const products = await sql<ProductWithCategory[]>`
      SELECT 
        p.id,
        p.name,
        p.description,
        p.category_id,
        p.base_price,
        p.minimum_quantity,
        p.max_participants,
        p.image_urls,
        p.specifications,
        p.is_active,
        p.created_by,
        p.created_at,
        p.updated_at,
        c.name as category_name,
        c.description as category_description
      FROM products p
      JOIN categories c ON p.category_id = c.id
      WHERE p.is_active = true
      ORDER BY p.name ASC;
    `;
    
    return products;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch products.');
  }
} 