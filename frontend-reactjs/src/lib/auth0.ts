import { env } from './env';

// Auth0 configuration for React SDK
export const auth0Config = {
  domain: env.AUTH0_DOMAIN,
  clientId: env.AUTH0_CLIENT_ID,
  authorizationParams: {
    redirect_uri: `${env.APP_BASE_URL}/callback`,
    audience: env.AUTH0_AUDIENCE,
    scope: "openid profile email read:posts write:posts read:users write:users",
  },
  cacheLocation: 'localstorage' as const,
  useRefreshTokens: true,
};

// Auth0 scopes and audience
export const AUTH0_SCOPES = "openid profile email read:posts write:posts read:users write:users";
export const AUTH0_AUDIENCE = env.AUTH0_AUDIENCE;