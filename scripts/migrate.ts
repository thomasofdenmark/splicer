import { migration009_add_user_roles } from '../app/lib/migrations';

async function main() {
  try {
    await migration009_add_user_roles();
    console.log('Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

main(); 