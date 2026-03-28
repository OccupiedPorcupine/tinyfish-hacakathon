import { NextRequest, NextResponse } from 'next/server';

// Protected routes that require authentication
const protectedRoutes = [
  '/founder-fit',
  '/scan',
  '/feed',
  '/saved',
  '/markets',
];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  );

  if (isProtectedRoute) {
    // Check for auth token/session
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      // Redirect to signin with return URL
      const signInUrl = new URL('/signin', request.url);
      signInUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(signInUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     * - signin, signup (auth pages)
     * - api (API routes - handle auth separately if needed)
     */
    '/((?!_next/static|_next/image|favicon.ico|public|signin|signup|api).*)',
  ],
};
