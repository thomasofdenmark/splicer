import { unstable_noStore as noStore } from 'next/cache';
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export interface UserDealParticipation {
  id: string;
  deal_id: string;
  deal_title: string;
  deal_status: string;
  product_name: string;
  product_image_url: string;
  quantity: number;
  deal_price: number;
  original_price: number;
  discount_percentage: number;
  joined_at: string;
  participation_status: string;
  notes: string;
  end_date: string;
  current_participants: number;
  target_participants: number;
  current_quantity: number;
  progress_percentage: number;
}

export interface UserDealStats {
  total_participations: number;
  active_deals: number;
  completed_deals: number;
  cancelled_deals: number;
  total_savings: number;
  total_quantity: number;
}

export interface UserCreatedDeal {
  id: string;
  title: string;
  status: string;
  product_name: string;
  product_image_url: string;
  current_participants: number;
  target_participants: number;
  current_quantity: number;
  deal_price: number;
  original_price: number;
  discount_percentage: number;
  start_date: string;
  end_date: string;
  progress_percentage: number;
}

export async function fetchUserDealParticipations(userId: string): Promise<UserDealParticipation[]> {
  noStore();
  
  try {
    const participations = await sql<UserDealParticipation[]>`
      SELECT 
        dp.id,
        dp.deal_id,
        gd.title as deal_title,
        gd.status as deal_status,
        p.name as product_name,
        p.image_urls[1] as product_image_url,
        dp.quantity,
        gd.deal_price,
        gd.original_price,
        gd.discount_percentage,
        dp.joined_at,
        dp.status as participation_status,
        dp.notes,
        gd.end_date,
        gd.current_participants,
        gd.target_participants,
        gd.current_quantity,
        ROUND((gd.current_participants::DECIMAL / gd.target_participants::DECIMAL) * 100, 1) as progress_percentage
      FROM deal_participants dp
      JOIN group_deals gd ON dp.deal_id = gd.id
      JOIN products p ON gd.product_id = p.id
      WHERE dp.user_id = ${userId}
      ORDER BY dp.joined_at DESC;
    `;

    return participations;
  } catch (error) {
    console.error('Failed to fetch user deal participations:', error);
    throw new Error('Failed to fetch user deal participations.');
  }
}

export async function fetchUserDealStats(userId: string): Promise<UserDealStats> {
  noStore();
  
  try {
    const stats = await sql<[UserDealStats]>`
      SELECT 
        COUNT(*) as total_participations,
        COUNT(CASE WHEN gd.status IN ('pending', 'active') AND dp.status = 'active' THEN 1 END) as active_deals,
        COUNT(CASE WHEN gd.status = 'completed' AND dp.status = 'active' THEN 1 END) as completed_deals,
        COUNT(CASE WHEN gd.status = 'cancelled' OR dp.status = 'cancelled' THEN 1 END) as cancelled_deals,
        COALESCE(SUM(
          CASE WHEN gd.status = 'completed' AND dp.status = 'active' 
          THEN (gd.original_price - gd.deal_price) * dp.quantity 
          ELSE 0 END
        ), 0) as total_savings,
        COALESCE(SUM(
          CASE WHEN dp.status = 'active' 
          THEN dp.quantity 
          ELSE 0 END
        ), 0) as total_quantity
      FROM deal_participants dp
      JOIN group_deals gd ON dp.deal_id = gd.id
      WHERE dp.user_id = ${userId};
    `;

    return stats[0] || {
      total_participations: 0,
      active_deals: 0,
      completed_deals: 0,
      cancelled_deals: 0,
      total_savings: 0,
      total_quantity: 0,
    };
  } catch (error) {
    console.error('Failed to fetch user deal stats:', error);
    throw new Error('Failed to fetch user deal stats.');
  }
}

export async function fetchUserCreatedDeals(userId: string): Promise<UserCreatedDeal[]> {
  noStore();
  
  try {
    const deals = await sql<UserCreatedDeal[]>`
      SELECT 
        gd.id,
        gd.title,
        gd.status,
        p.name as product_name,
        p.image_urls[1] as product_image_url,
        gd.current_participants,
        gd.target_participants,
        gd.current_quantity,
        gd.deal_price,
        gd.original_price,
        gd.discount_percentage,
        gd.start_date,
        gd.end_date,
        ROUND((gd.current_participants::DECIMAL / gd.target_participants::DECIMAL) * 100, 1) as progress_percentage
      FROM group_deals gd
      JOIN products p ON gd.product_id = p.id
      WHERE gd.created_by = ${userId}
      ORDER BY gd.created_at DESC;
    `;

    return deals;
  } catch (error) {
    console.error('Failed to fetch user created deals:', error);
    throw new Error('Failed to fetch user created deals.');
  }
} 