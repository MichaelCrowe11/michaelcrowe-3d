import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Gracefully handle environments without Clerk keys (local dev/build)
const isClerkEnabled = !!process.env.CLERK_SECRET_KEY || !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export default isClerkEnabled
  ? clerkMiddleware()
  : () => NextResponse.next();

export const config = {
  matcher: [
    // Skip Next.js internals and static assets
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Apply to API routes
    '/(api|trpc)(.*)',
  ],
};
