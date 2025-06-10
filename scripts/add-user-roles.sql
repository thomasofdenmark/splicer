-- Add role column to users table
ALTER TABLE users
ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin'));

-- Create index for role column
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Create a default admin user (change these credentials as needed)
-- Password is 'admin123!' hashed with bcrypt
INSERT INTO users (name, email, password, role)
VALUES ('Admin User', 'admin@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3bp.Vp/PpO', 'admin')
ON CONFLICT (email) DO UPDATE SET role = 'admin';

-- Update existing users to have 'user' role if not set
UPDATE users SET role = 'user' WHERE role IS NULL; 