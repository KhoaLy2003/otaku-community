import { Auth0Client } from "@auth0/nextjs-auth0/server";

export const auth0 = new Auth0Client({
  domain: process.env.AUTH0_DOMAIN,
  clientId: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  secret: process.env.AUTH0_SECRET,
  appBaseUrl: process.env.AUTH0_BASE_URL || process.env.APP_BASE_URL,
  signInReturnToPath: "/feed",
  authorizationParameters: {
    // Request access to your API
    audience: process.env.AUTH0_AUDIENCE || "https://api.otaku-community.com",
    scope: "openid profile email read:posts write:posts read:users write:users",
  },
  session: {
    absoluteDuration: 60 * 60 * 24 * 7, // 7 days
  },
});
