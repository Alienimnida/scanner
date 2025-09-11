import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher([
  "(/)",
  "/api/scan"
]);

export default clerkMiddleware(async (auth, req) => {
  if (req.nextUrl.pathname === '/api/scan') {
    const userAgent = req.headers.get('user-agent') || '';
    const isCliRequest = userAgent.includes('TrinexCLI');
    
    if (isCliRequest) {
      return;
    }
  }
  
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}