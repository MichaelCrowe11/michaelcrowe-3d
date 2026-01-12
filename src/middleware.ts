import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Check if Clerk is configured
const hasClerkKey = !!process.env.CLERK_SECRET_KEY;

export async function middleware(request: NextRequest) {
  // If Clerk is configured, use Clerk middleware
  if (hasClerkKey) {
    try {
      const { clerkMiddleware } = await import('@clerk/nextjs/server');
      // Create and run Clerk middleware
      const clerkHandler = clerkMiddleware();
      return clerkHandler(request, {} as any);
    } catch (error) {
      console.error('Clerk middleware error:', error);
      return NextResponse.next();
    }
  }

  // Without Clerk, just pass through
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip internal paths and static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Include API routes
    '/(api|trpc)(.*)',
  ],
};
