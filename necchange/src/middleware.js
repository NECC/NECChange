import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

/**
 * The /auth/signin callback is '/'
 *
 * @publicRoutes Anyone can access
 * @authRoutes Mustn't be signed in
 * @adminRoutes Must have SUPER_USER role in jwt token
 * @protectedRoutes Must be signed in
 *
 */
const publicRoutes = ["/"];
const authRoutes = ["/auth"];
const adminRoutes = ["/super_user", "/api/admin", "/api/users/delete_user", "/api/users/user_profile"];
const protectedRoutes = ["/profile", "/horario", "/feed"];

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
    cookieName:
      process.env.NODE_ENV === "production"
        ? "__Secure-next-auth.session-token"
        : "next-auth.session-token",
  });

  // Admin paths
  // if signed in and doesn't have role SUPER_USER, can't access /super_user/**
  if (adminRoutes.some((path) => pathname.startsWith(path))) {
    console.log('=== ADMIN ROUTE CHECK ===');
    console.log('Token:', JSON.stringify(token, null, 2));
    console.log('Token role:', token?.role);
    console.log('Is SUPER_USER?', token?.role === "SUPER_USER");
    
    if (!token || token.role !== "SUPER_USER") {
      console.log('Access denied - redirecting to home');
      return NextResponse.redirect(new URL("/", request.url));
    }
    console.log('Access granted');
  }

  // Protected paths
  // if not signed in, user can't access /horario and /feed
  if (protectedRoutes.some((path) => pathname.startsWith(path))) {
    if (!token) {
      // FIXED: Redirect to signin with the current path as callbackUrl
      const signInUrl = new URL("/auth/signin", request.url);
      signInUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }
    
    /* Some edge cases */
    if (pathname.startsWith("/profile") && token.partner === false) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    if (pathname.startsWith("/feed") && token.role === "OUTSIDER") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Auth paths
  // if signed in, user can't access /auth paths
  if (authRoutes.some((path) => pathname.startsWith(path))) {
    if (token) {
      // FIXED: Check if there's a valid callbackUrl to redirect to
      const callbackUrl = request.nextUrl.searchParams.get("callbackUrl");
      
      // Prevent redirect to auth pages
      if (callbackUrl && !callbackUrl.includes("/auth")) {
        return NextResponse.redirect(new URL(callbackUrl, request.url));
      }
      
      // Default redirect to home
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};