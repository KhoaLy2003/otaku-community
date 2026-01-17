# Auth0 User Synchronization Feature

This document describes the Auth0 user synchronization feature that keeps user data in sync between Auth0 and the
application database.

## Overview

The Auth0 sync feature provides:

- Automatic user creation when a new user logs in via Auth0
- User data synchronization between Auth0 and the database
- Secure JWT token validation
- Unique username generation to handle conflicts

## API Endpoints

### POST /users/sync

Synchronizes user data between Auth0 and the database.

**Authentication**: Required (JWT Bearer token)

**Request Body**:

```json
{
  "auth0Id": "auth0|123456789",
  "email": "user@example.com",
  "username": "username",
  "avatarUrl": "https://example.com/avatar.jpg",
  "name": "Full Name",
  "nickname": "nick",
  "locale": "en"
}
```

**Response**:

```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": "uuid",
    "auth0Id": "auth0|123456789",
    "username": "username",
    "email": "user@example.com",
    "avatarUrl": "https://example.com/avatar.jpg",
    "bio": null,
    "interests": [],
    "location": null,
    "role": "USER",
    "isNewUser": true,
    "createdAt": "2023-12-12T10:00:00Z",
    "updatedAt": "2023-12-12T10:00:00Z"
  }
}
```

### GET /users/me

Gets the current authenticated user's profile.

**Authentication**: Required (JWT Bearer token)

**Response**:

```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "id": "uuid",
    "username": "username",
    "avatarUrl": "https://example.com/avatar.jpg",
    "bio": null,
    "interests": [],
    "location": null,
    "createdAt": "2023-12-12T10:00:00Z"
  }
}
```

## How It Works

### 1. User Login Flow

1. User logs in via Auth0 in the frontend
2. Frontend receives JWT access token from Auth0
3. Frontend calls `/users/sync` with user data and JWT token
4. Backend validates JWT and syncs user data
5. User can now make authenticated requests

### 2. JWT Token Validation

- Validates token signature using Auth0's public keys
- Checks token issuer matches Auth0 domain
- Validates audience claim matches API identifier
- Extracts user information from JWT claims

### 3. User Synchronization Logic

- **New User**: Creates user record in database with Auth0 data
- **Existing User**: Updates user record with latest Auth0 data
- **Username Conflicts**: Automatically generates unique username by appending numbers
- **Email Conflicts**: Logs warning but doesn't update if email is taken by another user

### 4. Security Features

- JWT subject must match request auth0Id
- All user operations require valid JWT token
- CORS configured for frontend domain
- SQL injection protection via JPA

## Configuration

### Environment Variables

```yaml
auth0:
  audience: ${AUTH0_AUDIENCE:https://api.otaku-community.com}
  domain: ${AUTH0_DOMAIN:your-domain.auth0.com}

cors:
  allowed-origins: ${CORS_ALLOWED_ORIGINS:http://localhost:3000}
```

### Auth0 Setup

1. Create Auth0 API with identifier matching `auth0.audience`
2. Configure Auth0 Application to use the API
3. Set up CORS in Auth0 Dashboard for your frontend domain
4. Configure JWT token settings (RS256 algorithm)

## Database Schema

The `users` table includes:

- `auth0_id`: Unique Auth0 user identifier (from JWT subject)
- `email`: User email from Auth0
- `username`: Unique username (auto-generated if conflicts)
- `avatar_url`: Profile picture URL from Auth0
- `role`: User role (USER/ADMIN)
- Standard audit fields (created_at, updated_at, deleted_at)

## Error Handling

### Common Errors

- **400 Bad Request**: Auth0 ID mismatch, validation errors
- **401 Unauthorized**: Invalid or missing JWT token
- **404 Not Found**: User not found (for /users/me after sync)
- **409 Conflict**: Username/email conflicts (handled automatically)

### Error Response Format

```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Detailed error messages"]
}
```

## Testing

### Unit Tests

- `UserSyncIntegrationTest`: Tests sync endpoint functionality
- Covers new user creation, existing user updates, validation errors
- Uses Spring Security Test for JWT mocking

### Manual Testing

```bash
# Get JWT token from Auth0
TOKEN="your-jwt-token"

# Test sync endpoint
curl -X POST http://localhost:8080/api/users/sync \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "auth0Id": "auth0|123456",
    "email": "test@example.com",
    "username": "testuser",
    "avatarUrl": "https://example.com/avatar.jpg"
  }'

# Test current user endpoint
curl http://localhost:8080/api/users/me \
  -H "Authorization: Bearer $TOKEN"
```

## Frontend Integration

### React/Next.js Example

```javascript
import {useAuth0} from '@auth0/auth0-react';

const syncUser = async () => {
    const {user, getAccessTokenSilently} = useAuth0();

    try {
        const token = await getAccessTokenSilently({
            authorizationParams: {
                audience: 'https://api.otaku-community.com'
            }
        });

        const response = await fetch('/api/users/sync', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                auth0Id: user.sub,
                email: user.email,
                username: user.nickname || user.name,
                avatarUrl: user.picture
            })
        });

        const result = await response.json();
        console.log('User synced:', result.data);
    } catch (error) {
        console.error('Sync failed:', error);
    }
};
```

## Security Considerations

1. **JWT Validation**: Always validate JWT tokens server-side
2. **HTTPS Only**: Use HTTPS in production for token transmission
3. **Token Expiry**: Handle token refresh in frontend
4. **Rate Limiting**: Consider implementing rate limiting for sync endpoint
5. **Audit Logging**: Log all user sync operations for security monitoring

## Troubleshooting

### Common Issues

1. **Token Validation Fails**: Check Auth0 domain and audience configuration
2. **CORS Errors**: Verify CORS settings match frontend URL
3. **Username Conflicts**: Check unique username generation logic
4. **Database Errors**: Verify PostgreSQL connection and schema

### Debug Logging

Enable debug logging in `application.yml`:

```yaml
logging:
  level:
    com.otaku.community.feature.user: DEBUG
    org.springframework.security: DEBUG
```