# Auth0 Implementation Notes

## SDK Version

This implementation uses `@auth0/nextjs-auth0` version **4.13.2**, which has a different API than version 3.x.

## Key Differences from Documentation

### 1. Environment Variables

The SDK uses these environment variable names:
- `AUTH0_DOMAIN` (not `AUTH0_ISSUER_BASE_URL`)
- `APP_BASE_URL` (not `AUTH0_BASE_URL`)
- `AUTH0_CLIENT_ID`
- `AUTH0_CLIENT_SECRET`
- `AUTH0_SECRET`

### 2. Auth Routes

Auth routes are mounted at `/auth/*` (not `/api/auth/*`):
- Login: `/auth/login`
- Logout: `/auth/logout`
- Callback: `/auth/callback`
- Profile: `/auth/profile`

### 3. Middleware Integration

The middleware uses `auth0.middleware(request)` to handle auth routes automatically:

```typescript
if (pathname.startsWith("/auth/")) {
  return await auth0.middleware(request);
}
```

### 4. Session Access

Get the session using:
```typescript
const session = await auth0.getSession(request);
```

## Implementation Structure

```
frontend/
├── lib/
│   └── auth0.ts                    # Auth0Client instance
├── middleware.ts                   # Handles auth routes + protection
├── lib/contexts/
│   └── AuthContext.tsx             # React context for auth state
└── app/api/
    ├── auth/[auth0]/route.ts       # Placeholder (handled by middleware)
    └── user/sync/route.ts          # Backend user sync
```

## How It Works

1. **User clicks "Log In"** → Redirects to `/auth/login`
2. **Middleware intercepts** → `auth0.middleware()` handles the request
3. **Redirects to Auth0** → User authenticates
4. **Callback to `/auth/callback`** → Middleware handles callback
5. **Session created** → Encrypted cookie stored
6. **Frontend fetches profile** → From `/auth/profile`
7. **Syncs with backend** → POST to `/api/user/sync`
8. **User authenticated** → Can access protected routes

## Configuration

### Required Environment Variables

```env
AUTH0_SECRET='generated-with-openssl-rand-hex-32'
AUTH0_DOMAIN='your-domain.us.auth0.com'
AUTH0_CLIENT_ID='your-client-id'
AUTH0_CLIENT_SECRET='your-client-secret'
APP_BASE_URL='http://localhost:3000'
NEXT_PUBLIC_API_URL='http://localhost:8080/api'
```

### Auth0 Dashboard Settings

**Allowed Callback URLs:**
```
http://localhost:3000/auth/callback
```

**Allowed Logout URLs:**
```
http://localhost:3000
```

**Allowed Web Origins:**
```
http://localhost:3000
```

## Usage in Components

```typescript
import { useAuth } from '@/hooks/useAuth'

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth()
  
  if (!isAuthenticated) {
    return <button onClick={login}>Log In</button>
  }
  
  return (
    <div>
      <p>Welcome, {user?.username}!</p>
      <button onClick={logout}>Log Out</button>
    </div>
  )
}
```

## Protected Routes

Routes defined in `middleware.ts`:
- `/feed`
- `/profile`
- `/settings`
- `/create-post`

These automatically redirect to `/auth/login` if user is not authenticated.

## Session Cookie

The session is stored in an encrypted cookie named `appSession`:
- httpOnly: true (prevents XSS)
- secure: true (HTTPS only in production)
- sameSite: 'lax' (CSRF protection)
- Rolling duration: 24 hours
- Absolute duration: 7 days

## Troubleshooting

### "Module has no exported member" errors
✅ Fixed - Using correct imports from `@auth0/nextjs-auth0/server`

### Auth routes not working
- Ensure middleware is handling `/auth/*` paths
- Check that `auth0.middleware()` is called for auth routes

### Session not persisting
- Verify `AUTH0_SECRET` is set
- Check cookie settings in browser
- Ensure HTTPS in production

### User not syncing with backend
- Check `/api/user/sync` endpoint is working
- Verify backend is accepting Auth0 tokens
- Review browser console for errors

## Next Steps

1. Create Auth0 account and application
2. Configure environment variables
3. Update Auth0 dashboard with callback URLs
4. Test login flow
5. Implement backend user sync endpoint
6. Deploy to production

## References

- [Auth0 Next.js SDK v4 Docs](https://github.com/auth0/nextjs-auth0)
- [Auth0 Dashboard](https://manage.auth0.com)
- [Migration Guide](./MIGRATION_SUMMARY.md)
- [Setup Guide](./AUTH0_SETUP_GUIDE.md)
