# Database Migration Guide: Invoice Platform → Group Buying Platform

## 🎯 Overview

This guide will walk you through migrating your existing invoice/customer platform to a comprehensive group buying platform while preserving all existing data.

## ⚠️ IMPORTANT: Pre-Migration Checklist

Before starting the migration, complete these steps:

1. **Backup Production Database**
2. **Run migrations in development first**
3. **Test the new functionality**
4. **Plan for downtime if needed**

## 📊 Migration Strategy

### Current Schema (Before)
```
users (id, name, email, password)
customers (id, name, email, image_url)
invoices (id, customer_id, amount, status, date)
revenue (month, revenue)
```

### New Schema (After)
```
✅ users (enhanced with timestamps)
✅ customers (enhanced with timestamps) 
✅ invoices (enhanced with timestamps)
✅ revenue (unchanged)
🆕 categories (product organization)
🆕 products (product catalog)
🆕 discount_tiers (pricing tiers)
🆕 group_deals (group buying sessions)
🆕 deal_participants (users in deals)
🆕 user_profiles (extended user info)
🆕 migrations (tracking table)
```

## 🚀 Step-by-Step Migration Process

### Step 1: Create Data Backup

**Purpose:** Safeguard existing data before making any changes.

```bash
# Start development server
pnpm dev

# In another terminal or browser, create backup
curl http://localhost:3000/backup > backup-$(date +%Y%m%d).json

# Or visit in browser and download:
# http://localhost:3000/backup
```

**Expected Output:** JSON file with all current users, customers, invoices, and revenue data.

### Step 2: Run Initial Database Setup

**Purpose:** Create existing tables if they don't exist.

```bash
# Visit in browser or curl:
curl http://localhost:3000/seed
```

**What this does:**
- Creates users, customers, invoices, revenue tables
- Inserts sample data if tables are empty
- No data is overwritten

### Step 3: Execute Migrations

**Purpose:** Add new tables and enhance existing ones.

```bash
# Run all migrations:
curl http://localhost:3000/migrate

# Or visit in browser:
# http://localhost:3000/migrate
```

**What each migration does:**

1. **001_add_timestamps** - Adds `created_at` and `updated_at` to existing tables
2. **002_create_categories** - Creates categories table with 8 default categories
3. **003_create_products** - Creates products table with foreign keys
4. **004_create_discount_tiers** - Creates discount tier system
5. **005_create_group_deals** - Creates group deals table with business logic
6. **006_create_deal_participants** - Creates participant tracking
7. **007_create_user_profiles** - Creates extended user profiles
8. **008_create_update_triggers** - Adds auto-updating timestamp triggers

### Step 4: Verify Migration Success

**Purpose:** Ensure all tables were created correctly.

```sql
-- Check tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Check migration tracking
SELECT * FROM migrations ORDER BY executed_at;

-- Verify data integrity
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM categories;
```

**Expected Result:**
- All original data preserved
- 8 new categories created
- Migration tracking table populated
- New tables ready for group buying functionality

## 🔄 Rollback Process (If Needed)

If you need to rollback a specific migration:

```bash
# Rollback specific migration
curl "http://localhost:3000/migrate?action=rollback&migration=008_create_update_triggers"
```

**⚠️ Warning:** Rollbacks only remove migration tracking. Manual cleanup may be required.

## 🧪 Testing the Migration

### 1. Data Integrity Tests

```sql
-- Verify original data
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM customers; 
SELECT COUNT(*) FROM invoices;

-- Check new tables
SELECT COUNT(*) FROM categories;
SELECT name FROM categories ORDER BY name;
```

### 2. Application Tests

1. **Authentication** - Verify users can still log in
2. **Invoice System** - Ensure existing invoice functionality works
3. **New Categories** - Check categories are available for product creation

### 3. Performance Tests

```sql
-- Test indexes are working
EXPLAIN SELECT * FROM products WHERE category_id = 'uuid-here';
EXPLAIN SELECT * FROM group_deals WHERE status = 'active';
```

## 📈 Post-Migration Steps

### 1. Update Type Definitions

Your application now has access to new types:

```typescript
import { 
  Category, 
  Product, 
  GroupDeal, 
  DealParticipant,
  UserProfile 
} from '@/app/lib/group-buying-types';
```

### 2. Create Sample Data (Optional)

For development/testing, you can create sample products and deals:

```sql
-- Insert sample product
INSERT INTO products (name, description, category_id, base_price, minimum_quantity, created_by)
SELECT 
  'Sample Product',
  'A great product for group buying',
  c.id,
  99.99,
  5,
  u.id
FROM categories c, users u 
WHERE c.name = 'Electronics' 
AND u.email = 'your-email@example.com'
LIMIT 1;
```

### 3. Build New Features

Now you can start building:
- **Product Catalog** pages
- **Group Deal** creation and management
- **User Profiles** 
- **Real-time Deal** updates

## 🔧 Troubleshooting

### Common Issues

**1. Migration Fails with "relation already exists"**
```
Solution: The migration system handles this automatically with IF NOT EXISTS
```

**2. Foreign Key Constraint Errors**
```
Solution: Check that referenced tables exist and have correct data
```

**3. Permission Errors**
```
Solution: Ensure database user has CREATE, ALTER, and INSERT permissions
```

### Validation Queries

```sql
-- Check all tables were created
SELECT schemaname, tablename 
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;

-- Verify foreign key relationships
SELECT 
  tc.table_name, 
  tc.constraint_name, 
  tc.constraint_type,
  kcu.column_name,
  ccu.table_name AS foreign_table_name
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND tc.table_schema = 'public';
```

## 📋 Migration Checklist

- [ ] **Backup created and verified**
- [ ] **Migration ran successfully (all 8 completed)**
- [ ] **Original data intact (users/customers/invoices)**
- [ ] **New tables created (8 categories visible)**
- [ ] **Foreign keys working**
- [ ] **Triggers created for timestamps**
- [ ] **Authentication still works**
- [ ] **ESLint passing**
- [ ] **TypeScript compilation successful**

## 🎉 Success Criteria

✅ **Migration Complete When:**
- All original functionality preserved
- 8 new database tables created
- Categories populated with default data
- Migration tracking in place
- Ready to build group buying features

## 🚀 Next Steps

After migration completes successfully:

1. **Build Product Management** - Create/edit/list products
2. **Implement Group Deals** - Deal creation and participation
3. **Add Real-time Features** - Live participant counts, countdown timers
4. **Enhanced UI** - Modern group buying interface
5. **Payment Integration** - Process group deal payments

---

**Ready to migrate?** Start with Step 1: Create your backup! 🔄 