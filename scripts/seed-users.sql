-- Add role column to users table if it doesn't exist
ALTER TABLE users
ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin'));

-- Create index for role column
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Seed admin user
-- Password is 'admin123!' hashed with bcrypt (rounds=12)
INSERT INTO users (name, email, password, role)
VALUES ('Admin User', 'admin@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3bp.Vp/PpO', 'admin')
ON CONFLICT (email) DO UPDATE SET 
  role = 'admin',
  password = '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3bp.Vp/PpO',
  name = 'Admin User';

-- Seed regular user
-- Password is 'user123!' hashed with bcrypt (rounds=12)
INSERT INTO users (name, email, password, role)
VALUES ('John Doe', 'user@example.com', '$2b$12$K2KXEYGQgAEKLVZC7qXF2.uoD8RJzOYj3HVx2qGxG9F8Jp3K7uBwG', 'user')
ON CONFLICT (email) DO UPDATE SET 
  role = 'user',
  password = '$2b$12$K2KXEYGQgAEKLVZC7qXF2.uoD8RJzOYj3HVx2qGxG9F8Jp3K7uBwG',
  name = 'John Doe';

-- Update any existing users without roles to be regular users
UPDATE users SET role = 'user' WHERE role IS NULL;

-- Show summary
SELECT 
  role,
  COUNT(*) as user_count,
  string_agg(name || ' (' || email || ')', ', ') as users
FROM users 
GROUP BY role 
ORDER BY role; 