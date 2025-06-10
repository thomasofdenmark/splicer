import { unstable_noStore as noStore } from 'next/cache';
import postgres from 'postgres';

import type { 
  GroupDealWithProduct,
  DealParticipant,
  DealParticipantWithUser,
  GroupDealStats,
  PaginatedResponse 
} from './group-buying-types';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// Group Deal Functions
export async function fetchActiveDeals(
  page: number = 1,
  limit: number = 12
): Promise<PaginatedResponse<GroupDealWithProduct>> {
  noStore();
  
  try {
    const offset = (page - 1) * limit;
    
    // Get total count
    const countResult = await sql<[{ total: string }]>`
      SELECT COUNT(*) as total
      FROM group_deals gd
      JOIN products p ON gd.product_id = p.id
      JOIN categories c ON p.category_id = c.id
      WHERE gd.status IN ('pending', 'active')
      AND gd.end_date > NOW()
      AND p.is_active = true;
    `;
    
    const total = parseInt(countResult[0].total);
    
    // Get deals with product info
    const deals = await sql<GroupDealWithProduct[]>`
      SELECT 
        gd.id,
        gd.product_id,
        gd.title,
        gd.description,
        gd.target_participants,
        gd.target_quantity,
        gd.current_participants,
        gd.current_quantity,
        gd.deal_price,
        gd.original_price,
        gd.discount_percentage,
        gd.start_date,
        gd.end_date,
        gd.status,
        gd.created_by,
        gd.created_at,
        gd.updated_at,
        p.name as product_name,
        p.description as product_description,
        p.image_urls[1] as product_image_url,
        c.name as category_name,
        c.id as category_id
      FROM group_deals gd
      JOIN products p ON gd.product_id = p.id
      JOIN categories c ON p.category_id = c.id
      WHERE gd.status IN ('pending', 'active')
      AND gd.end_date > NOW()
      AND p.is_active = true
      ORDER BY gd.created_at DESC
      LIMIT ${limit} OFFSET ${offset};
    `;
    
    const totalPages = Math.ceil(total / limit);
    
    return {
      data: deals,
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
    throw new Error('Failed to fetch active deals.');
  }
}

export async function fetchDealById(id: string): Promise<GroupDealWithProduct | null> {
  noStore();
  
  try {
    const deals = await sql<GroupDealWithProduct[]>`
      SELECT 
        gd.id,
        gd.product_id,
        gd.title,
        gd.description,
        gd.target_participants,
        gd.target_quantity,
        gd.current_participants,
        gd.current_quantity,
        gd.deal_price,
        gd.original_price,
        gd.discount_percentage,
        gd.start_date,
        gd.end_date,
        gd.status,
        gd.created_by,
        gd.created_at,
        gd.updated_at,
        p.name as product_name,
        p.description as product_description,
        p.image_urls[1] as product_image_url,
        c.name as category_name,
        c.id as category_id
      FROM group_deals gd
      JOIN products p ON gd.product_id = p.id
      JOIN categories c ON p.category_id = c.id
      WHERE gd.id = ${id};
    `;
    
    return deals[0] || null;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch deal.');
  }
}

export async function fetchDealsByProduct(productId: string): Promise<GroupDealWithProduct[]> {
  noStore();
  
  try {
    const deals = await sql<GroupDealWithProduct[]>`
      SELECT 
        gd.id,
        gd.product_id,
        gd.title,
        gd.description,
        gd.target_participants,
        gd.target_quantity,
        gd.current_participants,
        gd.current_quantity,
        gd.deal_price,
        gd.original_price,
        gd.discount_percentage,
        gd.start_date,
        gd.end_date,
        gd.status,
        gd.created_by,
        gd.created_at,
        gd.updated_at,
        p.name as product_name,
        p.description as product_description,
        p.image_urls[1] as product_image_url,
        c.name as category_name,
        c.id as category_id
      FROM group_deals gd
      JOIN products p ON gd.product_id = p.id
      JOIN categories c ON p.category_id = c.id
      WHERE gd.product_id = ${productId}
      AND gd.status IN ('pending', 'active')
      AND gd.end_date > NOW()
      ORDER BY gd.created_at DESC;
    `;
    
    return deals;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch deals for product.');
  }
}

export async function fetchDealParticipants(dealId: string): Promise<DealParticipantWithUser[]> {
  noStore();
  
  try {
    const participants = await sql<DealParticipantWithUser[]>`
      SELECT 
        dp.id,
        dp.deal_id,
        dp.user_id,
        dp.quantity,
        dp.joined_at,
        dp.status,
        dp.notes,
        u.name as user_name,
        u.email as user_email,
        up.avatar_url
      FROM deal_participants dp
      JOIN users u ON dp.user_id = u.id
      LEFT JOIN user_profiles up ON u.id = up.user_id
      WHERE dp.deal_id = ${dealId}
      AND dp.status = 'active'
      ORDER BY dp.joined_at ASC;
    `;
    
    return participants;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch deal participants.');
  }
}

export async function fetchDealStats(dealId: string): Promise<GroupDealStats | null> {
  noStore();
  
  try {
    const stats = await sql<GroupDealStats[]>`
      SELECT 
        gd.id as deal_id,
        gd.current_participants as total_participants,
        gd.current_quantity as total_quantity,
        ROUND((gd.current_participants::numeric / gd.target_participants::numeric) * 100, 1) as completion_percentage,
        EXTRACT(EPOCH FROM (gd.end_date - NOW())) / 3600 as time_remaining_hours,
        (gd.current_participants >= gd.target_participants) as is_threshold_met,
        (gd.original_price - gd.deal_price) * gd.current_quantity as projected_savings
      FROM group_deals gd
      WHERE gd.id = ${dealId};
    `;
    
    return stats[0] || null;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch deal stats.');
  }
}

export async function fetchUserParticipation(userId: string, dealId: string): Promise<DealParticipant | null> {
  noStore();
  
  try {
    const participation = await sql<DealParticipant[]>`
      SELECT id, deal_id, user_id, quantity, joined_at, status, notes
      FROM deal_participants
      WHERE user_id = ${userId} AND deal_id = ${dealId}
      AND status = 'active';
    `;
    
    return participation[0] || null;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to check user participation.');
  }
}

export async function fetchUserDeals(userId: string): Promise<GroupDealWithProduct[]> {
  noStore();
  
  try {
    const deals = await sql<GroupDealWithProduct[]>`
      SELECT DISTINCT
        gd.id,
        gd.product_id,
        gd.title,
        gd.description,
        gd.target_participants,
        gd.target_quantity,
        gd.current_participants,
        gd.current_quantity,
        gd.deal_price,
        gd.original_price,
        gd.discount_percentage,
        gd.start_date,
        gd.end_date,
        gd.status,
        gd.created_by,
        gd.created_at,
        gd.updated_at,
        p.name as product_name,
        p.description as product_description,
        p.image_urls[1] as product_image_url,
        c.name as category_name,
        c.id as category_id
      FROM group_deals gd
      JOIN products p ON gd.product_id = p.id
      JOIN categories c ON p.category_id = c.id
      JOIN deal_participants dp ON gd.id = dp.deal_id
      WHERE dp.user_id = ${userId}
      AND dp.status = 'active'
      ORDER BY gd.created_at DESC;
    `;
    
    return deals;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch user deals.');
  }
}

// Search and filter functions
export async function searchDeals(
  query: string,
  categoryId?: string,
  minDiscount?: number,
  status?: string,
  page: number = 1,
  limit: number = 12,
  sort: string = 'newest'
): Promise<PaginatedResponse<GroupDealWithProduct>> {
  noStore();
  
  try {
    const offset = (page - 1) * limit;
    
    // Build WHERE clause
    const whereConditions = ['gd.end_date > NOW()', 'p.is_active = true'];
    const values: (string | number)[] = [];
    let paramCount = 0;
    
    if (query) {
      paramCount++;
      whereConditions.push(`(gd.title ILIKE $${paramCount} OR p.name ILIKE $${paramCount})`);
      values.push(`%${query}%`);
    }
    
    if (categoryId) {
      paramCount++;
      whereConditions.push(`c.id = $${paramCount}`);
      values.push(categoryId);
    }
    
    if (minDiscount) {
      paramCount++;
      whereConditions.push(`gd.discount_percentage >= $${paramCount}`);
      values.push(minDiscount);
    }
    
    if (status) {
      paramCount++;
      whereConditions.push(`gd.status = $${paramCount}`);
      values.push(status);
    } else {
      whereConditions.push('gd.status IN (\'pending\', \'active\')');
    }
    
    const whereClause = whereConditions.join(' AND ');
    
    // Build ORDER BY clause based on sort parameter
    let orderByClause = 'gd.created_at DESC'; // default
    switch (sort) {
      case 'ending_soon':
        orderByClause = 'gd.end_date ASC';
        break;
      case 'popular':
        orderByClause = 'gd.current_participants DESC, gd.created_at DESC';
        break;
      case 'discount_high':
        orderByClause = 'gd.discount_percentage DESC, gd.created_at DESC';
        break;
      case 'newest':
      default:
        orderByClause = 'gd.created_at DESC';
        break;
    }
    
    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM group_deals gd
      JOIN products p ON gd.product_id = p.id
      JOIN categories c ON p.category_id = c.id
      WHERE ${whereClause};
    `;
    
    const countResult = await sql.unsafe(countQuery, values);
    const total = parseInt(countResult[0].total);
    
    // Get deals
    const dealsQuery = 
      'SELECT ' +
        'gd.id, ' +
        'gd.product_id, ' +
        'gd.title, ' +
        'gd.description, ' +
        'gd.target_participants, ' +
        'gd.target_quantity, ' +
        'gd.current_participants, ' +
        'gd.current_quantity, ' +
        'gd.deal_price, ' +
        'gd.original_price, ' +
        'gd.discount_percentage, ' +
        'gd.start_date, ' +
        'gd.end_date, ' +
        'gd.status, ' +
        'gd.created_by, ' +
        'gd.created_at, ' +
        'gd.updated_at, ' +
        'p.name as product_name, ' +
        'p.description as product_description, ' +
        'p.image_urls[1] as product_image_url, ' +
        'c.name as category_name, ' +
        'c.id as category_id ' +
      'FROM group_deals gd ' +
      'JOIN products p ON gd.product_id = p.id ' +
      'JOIN categories c ON p.category_id = c.id ' +
      'WHERE ' + whereClause + ' ' +
      'ORDER BY ' + orderByClause + ' ' +
      'LIMIT $' + (paramCount + 1) + ' OFFSET $' + (paramCount + 2) + ';';
    
    const deals = await sql.unsafe(dealsQuery, [...values, limit, offset]) as GroupDealWithProduct[];
    
    const totalPages = Math.ceil(total / limit);
    
    return {
      data: deals,
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
    throw new Error('Failed to search deals.');
  }
}

// Admin function to fetch all deals (including expired and cancelled)
export async function fetchAllDealsForAdmin(
  query: string = '',
  categoryId?: string,
  status?: string,
  page: number = 1,
  limit: number = 20,
  sort: string = 'newest'
): Promise<PaginatedResponse<GroupDealWithProduct & { creator_name: string }>> {
  noStore();
  
  try {
    const offset = (page - 1) * limit;
    
    // Build WHERE clause - removed time restrictions for admin
    const whereConditions: string[] = [];
    const values: (string | number)[] = [];
    let paramCount = 0;
    
    if (query) {
      paramCount++;
      whereConditions.push(`(gd.title ILIKE $${paramCount} OR p.name ILIKE $${paramCount} OR u.name ILIKE $${paramCount})`);
      values.push(`%${query}%`);
    }
    
    if (categoryId) {
      paramCount++;
      whereConditions.push(`c.id = $${paramCount}`);
      values.push(categoryId);
    }
    
    if (status) {
      paramCount++;
      whereConditions.push(`gd.status = $${paramCount}`);
      values.push(status);
    }
    
    const whereClause = whereConditions.length > 0 ? 'WHERE ' + whereConditions.join(' AND ') : '';
    
    // Build ORDER BY clause based on sort parameter
    let orderByClause = 'gd.created_at DESC'; // default
    switch (sort) {
      case 'ending_soon':
        orderByClause = 'gd.end_date ASC';
        break;
      case 'popular':
        orderByClause = 'gd.current_participants DESC, gd.created_at DESC';
        break;
      case 'discount_high':
        orderByClause = 'gd.discount_percentage DESC, gd.created_at DESC';
        break;
      case 'newest':
      default:
        orderByClause = 'gd.created_at DESC';
        break;
    }
    
    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM group_deals gd
      JOIN products p ON gd.product_id = p.id
      JOIN categories c ON p.category_id = c.id
      JOIN users u ON gd.created_by = u.id
      ${whereClause};
    `;
    
    const countResult = await sql.unsafe(countQuery, values);
    const total = parseInt(countResult[0].total);
    
    // Get deals
    const dealsQuery = `
      SELECT 
        gd.id,
        gd.product_id,
        gd.title,
        gd.description,
        gd.target_participants,
        gd.target_quantity,
        gd.current_participants,
        gd.current_quantity,
        gd.deal_price,
        gd.original_price,
        gd.discount_percentage,
        gd.start_date,
        gd.end_date,
        gd.status,
        gd.created_by,
        gd.created_at,
        gd.updated_at,
        p.name as product_name,
        p.description as product_description,
        p.image_urls[1] as product_image_url,
        c.name as category_name,
        c.id as category_id,
        u.name as creator_name
      FROM group_deals gd
      JOIN products p ON gd.product_id = p.id
      JOIN categories c ON p.category_id = c.id
      JOIN users u ON gd.created_by = u.id
      ${whereClause}
      ORDER BY ${orderByClause}
      LIMIT $${paramCount + 1} OFFSET $${paramCount + 2};
    `;
    
    const deals = await sql.unsafe(dealsQuery, [...values, limit, offset]) as (GroupDealWithProduct & { creator_name: string })[];
    
    const totalPages = Math.ceil(total / limit);
    
    return {
      data: deals,
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
    throw new Error('Failed to fetch deals for admin.');
  }
} 