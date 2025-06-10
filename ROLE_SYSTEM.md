# Role-Based User System

## Overview

The Splicer platform now implements a two-tier user role system to separate regular marketplace users from platform administrators.

## User Roles

### 🔵 **Regular Users** (`role: 'user'`)
- **Access**: Public marketplace, deal participation, deal creation
- **Capabilities**:
  - Browse and join group deals
  - Create new group deals
  - View products and product details
  - Participate in group buying
  - Manage their own deal participation

### 🔴 **Admin Users** (`role: 'admin'`)
- **Access**: Full platform access including admin dashboard
- **Capabilities**:
  - All regular user capabilities
  - Access admin dashboard (`/dashboard`)
  - Manage products and categories
  - View platform analytics
  - Manage users and permissions
  - Platform configuration and settings

## Implementation Details

### Database Schema
```sql
-- Users table with role column
ALTER TABLE users
ADD COLUMN role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin'));
```

### Authentication & Authorization

#### Middleware Protection
- **Dashboard routes** (`/dashboard/*`): Admin-only access
- **Deal/Product creation**: Requires login (any role)
- **Public routes**: Open to all users

#### Session Management
- User role is stored in JWT token and session
- Role information available throughout the application
- Type-safe role checking with TypeScript

### UI Components

#### Role-Based Navigation
- **Regular Users**: See marketplace navigation, create deal options
- **Admin Users**: Additional admin dashboard links, management tools

#### Visual Indicators
- User role badges show current user type
- Different navigation options based on role
- Role-specific call-to-action buttons

## Setup Instructions

### 1. Database Migration
Run the SQL script to add role support:
```bash
# Execute the SQL script in your database
psql -d your_database < scripts/add-user-roles.sql
```

### 2. Default Admin User
A default admin user is created with:
- **Email**: `admin@example.com`
- **Password**: `admin123!`
- **Role**: `admin`

⚠️ **Security**: Change these credentials immediately in production!

### 3. Environment Setup
Ensure your authentication is properly configured with the role system:
- NextAuth.js configured with role support
- Session provider added to root layout
- Middleware protecting admin routes

## Usage Examples

### Checking User Role in Components
```tsx
import { useSession } from 'next-auth/react';

function MyComponent() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === 'admin';
  
  return (
    <div>
      {isAdmin && <AdminOnlyFeature />}
      <RegularUserFeature />
    </div>
  );
}
```

### Server-Side Role Checking
```tsx
import { auth } from '@/auth';

export default async function AdminPage() {
  const session = await auth();
  
  if (session?.user?.role !== 'admin') {
    redirect('/unauthorized');
  }
  
  return <AdminDashboard />;
}
```

### Protecting API Routes
```tsx
import { auth } from '@/auth';

export async function GET() {
  const session = await auth();
  
  if (session?.user?.role !== 'admin') {
    return new Response('Unauthorized', { status: 403 });
  }
  
  // Admin-only logic here
}
```

## Security Considerations

### Access Control
- All admin routes protected by middleware
- Role verification on both client and server
- Unauthorized access redirects to appropriate pages

### Data Protection
- Admin-only data queries check user role
- Sensitive operations require admin privileges
- User role cannot be modified by regular users

### Best Practices
- Always verify role on server-side for sensitive operations
- Use TypeScript for type-safe role checking
- Implement proper error handling for unauthorized access
- Log admin actions for audit trails

## Future Enhancements

### Potential Role Expansions
- **Moderator**: Limited admin capabilities
- **Vendor**: Product management only
- **Premium User**: Enhanced marketplace features

### Advanced Features
- Role-based permissions matrix
- Dynamic role assignment
- Role expiration and rotation
- Audit logging for role changes

## Troubleshooting

### Common Issues

1. **Role not showing in session**
   - Check if migration was applied
   - Verify NextAuth configuration
   - Clear browser session and re-login

2. **Unauthorized access errors**
   - Confirm user has correct role in database
   - Check middleware configuration
   - Verify route protection setup

3. **UI not updating based on role**
   - Ensure SessionProvider is in root layout
   - Check if components are using useSession correctly
   - Verify role-based conditional rendering

### Database Queries
```sql
-- Check user roles
SELECT id, name, email, role FROM users;

-- Update user role
UPDATE users SET role = 'admin' WHERE email = 'user@example.com';

-- Count users by role
SELECT role, COUNT(*) FROM users GROUP BY role;
``` 