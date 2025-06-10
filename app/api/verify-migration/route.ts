import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function GET() {
  try {
    // Check existing tables
    const existingTables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `;

    // Check migrations executed
    const migrations = await sql`
      SELECT name, executed_at 
      FROM migrations 
      ORDER BY executed_at;
    `;

    // Check categories were populated
    const categories = await sql`
      SELECT id, name 
      FROM categories 
      ORDER BY name;
    `;

    // Verify data integrity
    const dataCounts = await sql`
      SELECT 
        (SELECT COUNT(*) FROM users) as user_count,
        (SELECT COUNT(*) FROM customers) as customer_count,
        (SELECT COUNT(*) FROM invoices) as invoice_count,
        (SELECT COUNT(*) FROM categories) as category_count,
        (SELECT COUNT(*) FROM products) as product_count;
    `;

    return Response.json({
      status: 'success',
      timestamp: new Date().toISOString(),
      tables: existingTables.map(t => t.table_name),
      migrations_executed: migrations,
      categories: categories,
      data_counts: dataCounts[0],
      message: 'Migration verification completed successfully'
    });

  } catch (error) {
    console.error('Migration verification failed:', error);
    return Response.json(
      { 
        status: 'error',
        error: 'Migration verification failed', 
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      }, 
      { status: 500 }
    );
  }
} 