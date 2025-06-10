// Group Buying Platform Type Definitions

export type Category = {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  category_id: string;
  base_price: number;
  minimum_quantity: number;
  max_participants?: number;
  image_urls: string[];
  specifications: Record<string, string>;
  is_active: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
};

export type ProductWithCategory = Product & {
  category_name: string;
  category_description?: string;
};

export type DiscountTier = {
  id: string;
  product_id: string;
  minimum_participants: number;
  minimum_quantity?: number;
  discount_percentage?: number;
  discount_amount?: number;
  is_active: boolean;
  created_at: string;
};

export type GroupDeal = {
  id: string;
  product_id: string;
  title: string;
  description?: string;
  target_participants: number;
  target_quantity?: number;
  current_participants: number;
  current_quantity: number;
  deal_price: number;
  original_price: number;
  discount_percentage: number;
  start_date: string;
  end_date: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled' | 'expired';
  created_by: string;
  created_at: string;
  updated_at: string;
};

export type GroupDealWithProduct = GroupDeal & {
  product_name: string;
  product_description: string;
  product_image_url?: string;
  category_name: string;
  category_id: string;
};

export type DealParticipant = {
  id: string;
  deal_id: string;
  user_id: string;
  quantity: number;
  joined_at: string;
  status: 'active' | 'cancelled' | 'completed';
  notes?: string;
};

export type DealParticipantWithUser = DealParticipant & {
  user_name: string;
  user_email: string;
  avatar_url?: string;
};

export type UserProfile = {
  id: string;
  user_id: string;
  bio?: string;
  avatar_url?: string;
  phone?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  notifications_enabled: boolean;
  email_marketing: boolean;
  created_at: string;
  updated_at: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  created_at?: string;
  updated_at?: string;
};

export type UserWithProfile = User & {
  profile?: UserProfile;
};

// Statistics and Analytics Types
export type GroupDealStats = {
  deal_id: string;
  total_participants: number;
  total_quantity: number;
  completion_percentage: number;
  time_remaining_hours: number;
  is_threshold_met: boolean;
  projected_savings: number;
};

export type CategoryStats = {
  category_id: string;
  category_name: string;
  total_products: number;
  active_deals: number;
  total_participants: number;
  total_revenue: number;
};

export type AdminDashboardStats = {
  total_users: number;
  total_products: number;
  active_deals: number;
  completed_deals: number;
  total_revenue: number;
  revenue_this_month: number;
  top_categories: CategoryStats[];
  recent_deals: GroupDealWithProduct[];
};

// Form Types for Creating/Updating
export type CreateCategoryForm = {
  name: string;
  description?: string;
  image_url?: string;
};

export type CreateProductForm = {
  name: string;
  description: string;
  category_id: string;
  base_price: number;
  minimum_quantity: number;
  max_participants?: number;
  image_urls: string[];
  specifications?: Record<string, string>;
};

export type CreateGroupDealForm = {
  product_id: string;
  title: string;
  description?: string;
  target_participants: number;
  target_quantity?: number;
  discount_percentage: number;
  duration_hours: number;
};

export type JoinDealForm = {
  deal_id: string;
  quantity: number;
  notes?: string;
};

export type UpdateUserProfileForm = {
  bio?: string;
  avatar_url?: string;
  phone?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  notifications_enabled?: boolean;
  email_marketing?: boolean;
};

// API Response Types
export type ApiResponse<T> = {
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
};

export type PaginatedResponse<T> = {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
};

// Search and Filter Types
export type ProductFilters = {
  category_id?: string;
  min_price?: number;
  max_price?: number;
  in_stock?: boolean;
  has_active_deals?: boolean;
};

export type DealFilters = {
  status?: GroupDeal['status'][];
  category_id?: string;
  min_discount?: number;
  ending_soon?: boolean; // Within 24 hours
  almost_full?: boolean; // 80%+ participants
};

export type SearchParams = {
  query?: string;
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
};

// Migration Types
export type Migration = {
  id: number;
  name: string;
  executed_at: string;
};

// Server Action State Types
export type CategoryActionState = {
  errors?: {
    name?: string[];
    description?: string[];
    image_url?: string[];
  };
  message?: string | null;
};

export type ProductActionState = {
  errors?: {
    name?: string[];
    description?: string[];
    category_id?: string[];
    base_price?: string[];
    minimum_quantity?: string[];
    max_participants?: string[];
    image_urls?: string[];
  };
  message?: string | null;
};

export type GroupDealActionState = {
  errors?: {
    product_id?: string[];
    title?: string[];
    description?: string[];
    target_participants?: string[];
    target_quantity?: string[];
    discount_percentage?: string[];
    duration_hours?: string[];
  };
  message?: string | null;
  dealId?: string;
};

export type JoinDealActionState = {
  errors?: {
    deal_id?: string[];
    quantity?: string[];
    notes?: string[];
  };
  message?: string | null;
};

export type UserProfileActionState = {
  errors?: {
    bio?: string[];
    phone?: string[];
    address_line1?: string[];
    city?: string[];
    state?: string[];
    postal_code?: string[];
    country?: string[];
  };
  message?: string | null;
};

// Legacy types (for backward compatibility during migration)
export type Customer = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  created_at?: string;
  updated_at?: string;
};

export type Invoice = {
  id: string;
  customer_id: string;
  amount: number;
  date: string;
  status: 'pending' | 'paid';
  created_at?: string;
  updated_at?: string;
};

export type Revenue = {
  month: string;
  revenue: number;
}; 