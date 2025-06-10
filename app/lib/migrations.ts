import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// Migration tracking table
export async function createMigrationTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS migrations (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE,
      executed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;
}

// Check if migration has been run
export async function isMigrationExecuted(migrationName: string): Promise<boolean> {
  const result = await sql`
    SELECT COUNT(*) as count FROM migrations WHERE name = ${migrationName}
  `;
  return result[0].count > 0;
}

// Mark migration as executed
export async function markMigrationExecuted(migrationName: string) {
  await sql`
    INSERT INTO migrations (name) VALUES (${migrationName})
    ON CONFLICT (name) DO NOTHING;
  `;
}

// Migration 1: Add timestamp columns to existing tables
export async function migration001_add_timestamps() {
  const migrationName = '001_add_timestamps';
  
  if (await isMigrationExecuted(migrationName)) {
    console.log(`Migration ${migrationName} already executed, skipping...`);
    return;
  }

  console.log(`Running migration ${migrationName}...`);

  await sql.begin(async (sql) => {
    // Add timestamps to users table
    await sql`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;
    `;

    // Add timestamps to customers table  
    await sql`
      ALTER TABLE customers
      ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;
    `;

    // Add timestamps to invoices table
    await sql`
      ALTER TABLE invoices
      ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;
    `;

    await markMigrationExecuted(migrationName);
  });

  console.log(`Migration ${migrationName} completed!`);
}

// Migration 2: Create categories table
export async function migration002_create_categories() {
  const migrationName = '002_create_categories';
  
  if (await isMigrationExecuted(migrationName)) {
    console.log(`Migration ${migrationName} already executed, skipping...`);
    return;
  }

  console.log(`Running migration ${migrationName}...`);

  await sql.begin(async (sql) => {
    await sql`
      CREATE TABLE IF NOT EXISTS categories (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        description TEXT,
        image_url VARCHAR(255),
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Insert default categories
    const defaultCategories = [
      { name: 'Electronics', description: 'Tech gadgets, devices, and accessories' },
      { name: 'Home & Garden', description: 'Home improvement, furniture, and gardening supplies' },
      { name: 'Fashion & Apparel', description: 'Clothing, shoes, and fashion accessories' },
      { name: 'Sports & Outdoors', description: 'Sports equipment, outdoor gear, and fitness items' },
      { name: 'Books & Media', description: 'Books, movies, music, and educational materials' },
      { name: 'Health & Beauty', description: 'Health products, cosmetics, and personal care' },
      { name: 'Automotive', description: 'Car accessories, tools, and automotive supplies' },
      { name: 'Food & Beverages', description: 'Specialty foods, beverages, and kitchen items' },
    ];

    for (const category of defaultCategories) {
      await sql`
        INSERT INTO categories (name, description)
        VALUES (${category.name}, ${category.description})
        ON CONFLICT (name) DO NOTHING;
      `;
    }

    await markMigrationExecuted(migrationName);
  });

  console.log(`Migration ${migrationName} completed!`);
}

// Migration 3: Create products table
export async function migration003_create_products() {
  const migrationName = '003_create_products';
  
  if (await isMigrationExecuted(migrationName)) {
    console.log(`Migration ${migrationName} already executed, skipping...`);
    return;
  }

  console.log(`Running migration ${migrationName}...`);

  await sql.begin(async (sql) => {
    await sql`
      CREATE TABLE IF NOT EXISTS products (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        category_id UUID NOT NULL REFERENCES categories(id),
        base_price DECIMAL(10,2) NOT NULL CHECK (base_price > 0),
        minimum_quantity INTEGER NOT NULL DEFAULT 1 CHECK (minimum_quantity > 0),
        max_participants INTEGER CHECK (max_participants IS NULL OR max_participants > 0),
        image_urls TEXT[] DEFAULT '{}',
        specifications JSONB DEFAULT '{}',
        is_active BOOLEAN DEFAULT true,
        created_by UUID NOT NULL REFERENCES users(id),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Create indexes separately
    await sql`CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_products_created_by ON products(created_by);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_products_price ON products(base_price);`;

    await markMigrationExecuted(migrationName);
  });

  console.log(`Migration ${migrationName} completed!`);
}

// Migration 4: Create discount tiers table
export async function migration004_create_discount_tiers() {
  const migrationName = '004_create_discount_tiers';
  
  if (await isMigrationExecuted(migrationName)) {
    console.log(`Migration ${migrationName} already executed, skipping...`);
    return;
  }

  console.log(`Running migration ${migrationName}...`);

  await sql.begin(async (sql) => {
    await sql`
      CREATE TABLE IF NOT EXISTS discount_tiers (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
        minimum_participants INTEGER NOT NULL CHECK (minimum_participants > 0),
        minimum_quantity INTEGER CHECK (minimum_quantity IS NULL OR minimum_quantity > 0),
        discount_percentage DECIMAL(5,2) NOT NULL CHECK (discount_percentage > 0 AND discount_percentage < 100),
        discount_amount DECIMAL(10,2) CHECK (discount_amount IS NULL OR discount_amount > 0),
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        
        -- Ensure logical constraints
        CHECK ((discount_percentage IS NOT NULL) != (discount_amount IS NOT NULL))
      );
    `;

    // Create indexes separately
    await sql`CREATE INDEX IF NOT EXISTS idx_discount_tiers_product ON discount_tiers(product_id);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_discount_tiers_participants ON discount_tiers(minimum_participants);`;

    await markMigrationExecuted(migrationName);
  });

  console.log(`Migration ${migrationName} completed!`);
}

// Migration 5: Create group deals table
export async function migration005_create_group_deals() {
  const migrationName = '005_create_group_deals';
  
  if (await isMigrationExecuted(migrationName)) {
    console.log(`Migration ${migrationName} already executed, skipping...`);
    return;
  }

  console.log(`Running migration ${migrationName}...`);

  await sql.begin(async (sql) => {
    await sql`
      CREATE TABLE IF NOT EXISTS group_deals (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        product_id UUID NOT NULL REFERENCES products(id),
        title VARCHAR(255) NOT NULL,
        description TEXT,
        target_participants INTEGER NOT NULL CHECK (target_participants > 0),
        target_quantity INTEGER CHECK (target_quantity IS NULL OR target_quantity > 0),
        current_participants INTEGER DEFAULT 0 CHECK (current_participants >= 0),
        current_quantity INTEGER DEFAULT 0 CHECK (current_quantity >= 0),
        deal_price DECIMAL(10,2) NOT NULL CHECK (deal_price > 0),
        original_price DECIMAL(10,2) NOT NULL CHECK (original_price > 0),
        discount_percentage DECIMAL(5,2) NOT NULL CHECK (discount_percentage > 0 AND discount_percentage < 100),
        start_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        end_date TIMESTAMP WITH TIME ZONE NOT NULL,
        status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed', 'cancelled', 'expired')),
        created_by UUID NOT NULL REFERENCES users(id),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        
        -- Business logic constraints
        CHECK (end_date > start_date),
        CHECK (deal_price < original_price),
        CHECK (current_participants <= target_participants OR target_participants IS NULL)
      );
    `;

    // Create indexes separately
    await sql`CREATE INDEX IF NOT EXISTS idx_group_deals_product ON group_deals(product_id);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_group_deals_status ON group_deals(status);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_group_deals_dates ON group_deals(start_date, end_date);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_group_deals_created_by ON group_deals(created_by);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_group_deals_active ON group_deals(status, end_date) WHERE status IN ('pending', 'active');`;

    await markMigrationExecuted(migrationName);
  });

  console.log(`Migration ${migrationName} completed!`);
}

// Migration 6: Create deal participants table
export async function migration006_create_deal_participants() {
  const migrationName = '006_create_deal_participants';
  
  if (await isMigrationExecuted(migrationName)) {
    console.log(`Migration ${migrationName} already executed, skipping...`);
    return;
  }

  console.log(`Running migration ${migrationName}...`);

  await sql.begin(async (sql) => {
    await sql`
      CREATE TABLE IF NOT EXISTS deal_participants (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        deal_id UUID NOT NULL REFERENCES group_deals(id) ON DELETE CASCADE,
        user_id UUID NOT NULL REFERENCES users(id),
        quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
        joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'completed')),
        notes TEXT,
        
        -- Ensure user can only join a deal once (but can change quantity)
        UNIQUE(deal_id, user_id)
      );
    `;

    // Create indexes separately
    await sql`CREATE INDEX IF NOT EXISTS idx_deal_participants_deal ON deal_participants(deal_id);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_deal_participants_user ON deal_participants(user_id);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_deal_participants_status ON deal_participants(status);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_deal_participants_joined ON deal_participants(joined_at);`;

    await markMigrationExecuted(migrationName);
  });

  console.log(`Migration ${migrationName} completed!`);
}

// Migration 7: Create user profiles table
export async function migration007_create_user_profiles() {
  const migrationName = '007_create_user_profiles';
  
  if (await isMigrationExecuted(migrationName)) {
    console.log(`Migration ${migrationName} already executed, skipping...`);
    return;
  }

  console.log(`Running migration ${migrationName}...`);

  await sql.begin(async (sql) => {
    await sql`
      CREATE TABLE IF NOT EXISTS user_profiles (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        bio TEXT,
        avatar_url VARCHAR(255),
        phone VARCHAR(20),
        address_line1 VARCHAR(255),
        address_line2 VARCHAR(255),
        city VARCHAR(100),
        state VARCHAR(100),
        postal_code VARCHAR(20),
        country VARCHAR(100),
        notifications_enabled BOOLEAN DEFAULT true,
        email_marketing BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        
        -- One profile per user
        UNIQUE(user_id)
      );
    `;

    // Create index separately
    await sql`CREATE INDEX IF NOT EXISTS idx_user_profiles_user ON user_profiles(user_id);`;

    await markMigrationExecuted(migrationName);
  });

  console.log(`Migration ${migrationName} completed!`);
}

// Migration 8: Create triggers for updated_at timestamps
export async function migration008_create_update_triggers() {
  const migrationName = '008_create_update_triggers';
  
  if (await isMigrationExecuted(migrationName)) {
    console.log(`Migration ${migrationName} already executed, skipping...`);
    return;
  }

  console.log(`Running migration ${migrationName}...`);

  await sql.begin(async (sql) => {
    // Create update timestamp function
    await sql`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ language 'plpgsql';
    `;

    // Create triggers for all tables with updated_at columns
    const tables = [
      'users', 'customers', 'invoices', 'categories', 
      'products', 'group_deals', 'user_profiles'
    ];

    for (const table of tables) {
      const triggerName = `update_${table}_updated_at`;
      await sql`DROP TRIGGER IF EXISTS ${sql.unsafe(triggerName)} ON ${sql.unsafe(table)};`;
      await sql`
        CREATE TRIGGER ${sql.unsafe(triggerName)}
          BEFORE UPDATE ON ${sql.unsafe(table)}
          FOR EACH ROW
          EXECUTE FUNCTION update_updated_at_column();
      `;
    }

    await markMigrationExecuted(migrationName);
  });

  console.log(`Migration ${migrationName} completed!`);
}

// Migration 9: Add user roles
export async function migration009_add_user_roles() {
  const migrationName = '009_add_user_roles';
  
  if (await isMigrationExecuted(migrationName)) {
    console.log(`Migration ${migrationName} already executed, skipping...`);
    return;
  }

  console.log(`Running migration ${migrationName}...`);

  await sql.begin(async (sql) => {
    // Add role column to users table
    await sql`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin'));
    `;

    // Create index for role column
    await sql`CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);`;

    // Create a default admin user (you can change these credentials)
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash('admin123!', 12);

    await sql`
      INSERT INTO users (name, email, password, role)
      VALUES ('Admin User', 'admin@example.com', ${hashedPassword}, 'admin')
      ON CONFLICT (email) DO UPDATE SET role = 'admin';
    `;

    await markMigrationExecuted(migrationName);
  });

  console.log(`Migration ${migrationName} completed!`);
  console.log(`✅ Default admin user created: admin@example.com / admin123!`);
}

// Main migration runner
export async function runAllMigrations() {
  console.log('🚀 Starting database migrations...');
  
  // Ensure migration table exists
  await createMigrationTable();
  
  // Run migrations in order
  await migration001_add_timestamps();
  await migration002_create_categories();
  await migration003_create_products();
  await migration004_create_discount_tiers();
  await migration005_create_group_deals();
  await migration006_create_deal_participants();
  await migration007_create_user_profiles();
  await migration008_create_update_triggers();
  await migration009_add_user_roles();
  
  console.log('✅ All migrations completed successfully!');
}

// Rollback function (use with caution!)
export async function rollbackMigration(migrationName: string) {
  console.warn(`⚠️  Rolling back migration: ${migrationName}`);
  
  await sql`
    DELETE FROM migrations WHERE name = ${migrationName};
  `;
  
  console.log(`Migration ${migrationName} marked as not executed. Manual cleanup may be required.`);
} 