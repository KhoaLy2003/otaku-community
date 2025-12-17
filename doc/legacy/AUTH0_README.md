# Auth0 Authentication System

This document describes the Auth0 authentication system implemented for the Otaku Community platform.

## Overview

The application uses Auth0 for secure authentication and authorization. Auth0 provides:
- Secure user authentication
- Social login options (Google, GitHub, etc.)
- Multi-factor authentication (MFA)
- Password reset flows
- User management

## Setup Instructions

### 1. Create Auth0 Account

1. Go to [Auth0](https://auth0.com/) and create a free account
2. Create a new application (Regular Web Application)
3. Note your Domain, Client ID, and Client Secret

### 2. Configure Auth0 Application

In your Auth0 dashboard:

**Allowed Callback URLs:**
```
http://localhost:3000/api/auth/callback
https://yourdomain.com/api/auth/callback
```

**Allowed Logout URLs:**
```
http://localhost:3000
https://yourdomain.com
```

**Allowed Web Origins:**
```
http://localhost:3000
https://yourdomain.com
```

### 3. Environment Variables

Create a `.env.local` file in the frontend directory:

```bash
# Generate a secret with: openssl rand -hex 32
AUTH0_SECRET='your-generated-secret-here'

# Your local or production URL
AUTH0_BASE_URL='http://localhost:3000'

# From Auth0 Dashboard
AUTH0_ISSUER_BASE_URL='https://your-domain.auth0.com'
AUTH0_CLIENT_ID='your-client-id'
AUTH0_CLIENT_SECRET='your-client-secret'

# Backend API URL
NEXT_PUBLIC_API_URL='http://localhost:8080/api'
```

### 4. Generate AUTH0_SECRET

Run this command to generate a secure secret:
```bash
openssl rand -hex 32
```

## Features Implemented

### ✅ Auth0 Integration
- Universal Login with Auth0
- Secure session management
- Automatic token refresh
- Social login support (configurable in Auth0)

### ✅ User Synchronization
- Automatic user sync with backend on login
- User profile data from Auth0
- Avatar and email synchronization

### ✅ Protected Routes
- Middleware-based route protection
- Automatic redirect to login for unauthenticated users
- Return URL preservation

### ✅ Session Management
- Secure cookie-based sessions
- 24-hour rolling session duration
- 7-day absolute session duration
- Automatic session refresh

## File Structure

```
frontend/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   └── [auth0]/route.ts      # Auth0 route handlers
│   │   └── user/
│   │       └── sync/route.ts          # User sync endpoint
│   ├── (auth)/
│   │   └── login/page.tsx             # Login page
│   └── layout.tsx                     # Root layout with providers
├── lib/
│   ├── auth0.ts                       # Auth0 configuration
│   └── contexts/
│       └── AuthContext.tsx            # Auth context with Auth0
├── components/
│   ├── auth/
│   │   └── LoginForm.tsx              # Auth0 login button
│   └── layout/
│       └── Header.tsx                 # Header with auth state
├── middleware.ts                      # Route protection
└── .env.local.example                 # Environment template
```

## Usage

### Using Auth Context

```tsx
import { useAuth } from '@/hooks/useAuth'

function MyComponent() {
  const { user, isAuthenticated, isLoading, login, logout, auth0User } = useAuth()

  if (isLoading) return <div>Loading...</div>
  
  if (!isAuthenticated) {
    return <button onClick={login}>Login with Auth0</button>
  }

  return (
    <div>
      <p>Welcome, {user?.username}!</p>
      <p>Email: {auth0User?.email}</p>
      <button onClick={logout}>Logout</button>
    </div>
  )
}
```

### Auth0 User Object

The `auth0User` object contains:
- `sub`: Auth0 user ID
- `email`: User email
- `name`: User full name
- `nickname`: Username
- `picture`: Avatar URL
- `email_verified`: Email verification status

### Backend Integration

The frontend syncs users with your backend via `/api/user/sync`. Your backend should:

1. Accept POST requests to `/users/sync`
2. Receive Auth0 user data
3. Create or update user in your database
4. Return user data in your format

Example backend endpoint:
```java
@PostMapping("/users/sync")
public ResponseEntity<User> syncUser(@RequestBody UserSyncRequest request) {
    // Find or create user with auth0Id
    User user = userService.findOrCreateByAuth0Id(
        request.getAuth0Id(),
        request.getEmail(),
        request.getUsername(),
        request.getAvatar()
    );
    return ResponseEntity.ok(user);
}
```

## API Routes

### Auth Routes (provided by Auth0)
- `GET /api/auth/login` - Initiate login
- `GET /api/auth/logout` - Logout user
- `GET /api/auth/callback` - Auth0 callback
- `GET /api/auth/me` - Get current user session

### Custom Routes
- `POST /api/user/sync` - Sync Auth0 user with backend

## Protected Routes

Routes requiring authentication:
- `/feed` - Main feed
- `/profile/*` - User profiles
- `/settings` - User settings
- `/create-post` - Create new post

## Security Features

✅ **Implemented:**
- Secure cookie-based sessions
- HTTPS-only cookies in production
- CSRF protection via Auth0
- Secure token storage (httpOnly cookies)
- Automatic session expiration
- Server-side session validation

✅ **Auth0 Provides:**
- Brute force protection
- Breached password detection
- Anomaly detection
- Bot detection
- Multi-factor authentication (configurable)

## Testing

### Local Development

1. Set up environment variables in `.env.local`
2. Run the development server:
   ```bash
   npm run dev
   ```
3. Navigate to `http://localhost:3000`
4. Click "Log In with Auth0"
5. Create an account or sign in
6. You'll be redirected back to the app

### Test User Flow

1. Click "Log In with Auth0" on the login page
2. Sign up with email or social provider
3. Complete Auth0 authentication
4. Get redirected to `/feed`
5. User data syncs with backend
6. Access protected routes
7. Click logout to end session

## Customization

### Add Social Providers

In Auth0 Dashboard:
1. Go to Authentication > Social
2. Enable providers (Google, GitHub, Facebook, etc.)
3. Configure OAuth credentials
4. Users can now sign in with social accounts

### Customize Login Page

In Auth0 Dashboard:
1. Go to Branding > Universal Login
2. Customize colors, logo, and text
3. Changes apply immediately

### Add Multi-Factor Authentication

In Auth0 Dashboard:
1. Go to Security > Multi-factor Auth
2. Enable MFA methods (SMS, authenticator app, etc.)
3. Configure policies

## Troubleshooting

### "Invalid state" error
- Check that AUTH0_SECRET is set and consistent
- Verify callback URLs in Auth0 dashboard

### "Callback URL mismatch" error
- Ensure callback URL in Auth0 matches your app URL
- Check AUTH0_BASE_URL environment variable

### User not syncing with backend
- Verify NEXT_PUBLIC_API_URL is correct
- Check backend `/users/sync` endpoint is working
- Review browser console for errors

### Session not persisting
- Check that cookies are enabled
- Verify AUTH0_SECRET is set
- Ensure HTTPS in production

## Production Deployment

### Environment Variables

Set these in your production environment:
```bash
AUTH0_SECRET='production-secret-here'
AUTH0_BASE_URL='https://yourdomain.com'
AUTH0_ISSUER_BASE_URL='https://your-domain.auth0.com'
AUTH0_CLIENT_ID='your-client-id'
AUTH0_CLIENT_SECRET='your-client-secret'
NEXT_PUBLIC_API_URL='https://api.yourdomain.com'
```

### Auth0 Configuration

1. Add production URLs to Auth0 dashboard
2. Enable HTTPS-only cookies
3. Configure custom domain (optional)
4. Set up monitoring and logs

### Security Checklist

- [ ] Use HTTPS for all connections
- [ ] Set secure environment variables
- [ ] Enable Auth0 anomaly detection
- [ ] Configure rate limiting
- [ ] Set up monitoring and alerts
- [ ] Review Auth0 security logs regularly
- [ ] Enable MFA for admin accounts
- [ ] Configure password policies

## Migration from Custom Auth

If migrating from custom authentication:

1. Keep existing user data in database
2. Add `auth0Id` field to user table
3. Link Auth0 accounts to existing users by email
4. Gradually migrate users to Auth0
5. Deprecate old authentication system

## Resources

- [Auth0 Documentation](https://auth0.com/docs)
- [Auth0 Next.js SDK](https://github.com/auth0/nextjs-auth0)
- [Auth0 Dashboard](https://manage.auth0.com)
- [Auth0 Community](https://community.auth0.com)

## Support

For issues with:
- **Auth0 service**: Contact Auth0 support
- **Integration**: Check this documentation and Auth0 SDK docs
- **Backend sync**: Review backend API logs
