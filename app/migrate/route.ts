import { NextRequest } from 'next/server';

import { runAllMigrations, rollbackMigration } from '@/app/lib/migrations';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const action = searchParams.get('action');
  const migrationName = searchParams.get('migration');

  try {
    if (action === 'rollback' && migrationName) {
      await rollbackMigration(migrationName);
      return Response.json({ 
        message: `Migration ${migrationName} rolled back successfully`,
        warning: 'Manual cleanup may be required'
      });
    }
    
    // Default action: run all migrations
    await runAllMigrations();
    
    return Response.json({ 
      message: 'All migrations completed successfully!',
      timestamp: new Date().toISOString(),
      migrationsRun: [
        '001_add_timestamps',
        '002_create_categories', 
        '003_create_products',
        '004_create_discount_tiers',
        '005_create_group_deals',
        '006_create_deal_participants',
        '007_create_user_profiles',
        '008_create_update_triggers'
      ]
    });
    
  } catch (error) {
    console.error('Migration failed:', error);
    return Response.json(
      { 
        error: 'Migration failed', 
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      }, 
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  // For running specific migrations in the future
  try {
    const body = await request.json();
    const { migration } = body;
    
    if (!migration) {
      return Response.json(
        { error: 'Migration name is required' },
        { status: 400 }
      );
    }
    
    // Import specific migration function dynamically
    const migrations = await import('@/app/lib/migrations');
    const migrationFunction = migrations[migration as keyof typeof migrations];
    
    if (typeof migrationFunction !== 'function') {
      return Response.json(
        { error: `Migration ${migration} not found` },
        { status: 404 }
      );
    }
    
    await (migrationFunction as () => Promise<void>)();
    
    return Response.json({
      message: `Migration ${migration} completed successfully`,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Specific migration failed:', error);
    return Response.json(
      { 
        error: 'Migration failed', 
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
} 