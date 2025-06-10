import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function GET() {
  try {
    console.log('🔄 Creating database backup...');

    // Backup all existing data
    const users = await sql`SELECT * FROM users`;
    const customers = await sql`SELECT * FROM customers`;
    const invoices = await sql`SELECT * FROM invoices`;
    const revenue = await sql`SELECT * FROM revenue`;

    const backup = {
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      tables: {
        users: users,
        customers: customers,
        invoices: invoices,
        revenue: revenue,
      },
      metadata: {
        user_count: users.length,
        customer_count: customers.length,
        invoice_count: invoices.length,
        revenue_entries: revenue.length,
      },
    };

    console.log('✅ Backup created successfully');
    console.log(`📊 Backed up: ${users.length} users, ${customers.length} customers, ${invoices.length} invoices`);

    // Return backup data as JSON
    return Response.json(backup, {
      headers: {
        'Content-Disposition': `attachment; filename="database-backup-${new Date().toISOString().split('T')[0]}.json"`,
        'Content-Type': 'application/json',
      },
    });

  } catch (error) {
    console.error('❌ Backup failed:', error);
    return Response.json(
      { 
        error: 'Backup failed', 
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      }, 
      { status: 500 }
    );
  }
}

export async function POST() {
  // For restoring from backup in the future
  return Response.json(
    { message: 'Backup restore functionality not implemented yet' },
    { status: 501 }
  );
} 