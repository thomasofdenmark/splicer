import bcrypt from 'bcrypt';
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

async function seedUsers() {
  console.log('🌱 Seeding users...');

  try {
    // First, ensure the role column exists
    await sql`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin'));
    `;

    // Create index for role column if it doesn't exist
    await sql`CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);`;

    // Hash passwords
    const adminPassword = await bcrypt.hash('admin123!', 12);
    const userPassword = await bcrypt.hash('user123!', 12);

    // Seed admin user
    await sql`
      INSERT INTO users (name, email, password, role)
      VALUES ('Admin User', 'admin@example.com', ${adminPassword}, 'admin')
      ON CONFLICT (email) DO UPDATE SET 
        role = 'admin',
        password = ${adminPassword},
        name = 'Admin User';
    `;
    console.log('✅ Admin user created/updated: admin@example.com / admin123!');

    // Seed regular user
    await sql`
      INSERT INTO users (name, email, password, role)
      VALUES ('John Doe', 'user@example.com', ${userPassword}, 'user')
      ON CONFLICT (email) DO UPDATE SET 
        role = 'user',
        password = ${userPassword},
        name = 'John Doe';
    `;
    console.log('✅ Regular user created/updated: user@example.com / user123!');

    // Update any existing users without roles to be regular users
    const updated = await sql`
      UPDATE users 
      SET role = 'user' 
      WHERE role IS NULL;
    `;
    console.log(`✅ Updated ${updated.count} existing users to have 'user' role`);

    // Show summary
    const userCounts = await sql`
      SELECT role, COUNT(*) as count 
      FROM users 
      GROUP BY role 
      ORDER BY role;
    `;

    console.log('\n📊 User Summary:');
    userCounts.forEach(row => {
      console.log(`  ${row.role}: ${row.count} users`);
    });

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  } finally {
    await sql.end();
  }
}

async function main() {
  try {
    await seedUsers();
    console.log('\n🎉 Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('💥 Seeding failed:', error);
    process.exit(1);
  }
}

// Check if script is being run directly
if (require.main === module) {
  main();
}

export { seedUsers }; 