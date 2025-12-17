// Auth routes are handled by middleware
// This file is kept for Next.js routing structure
// The actual auth handling is done in middleware.ts using auth0.middleware()

export async function GET() {
  return new Response('Auth routes are handled by middleware', { status: 404 })
}
