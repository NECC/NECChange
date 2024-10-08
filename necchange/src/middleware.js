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
  if (adminRoutes.some((path) => request.nextUrl.pathname.startsWith(path))) {
    if (!token || token.role != "SUPER_USER")
      return NextResponse.redirect(new URL("/", request.url));
  }

  // Protected paths
  // if not signed in, user can't access /horario and /feed
  if (
    protectedRoutes.some((path) => request.nextUrl.pathname.startsWith(path))
  ) {
    if (!token) return NextResponse.redirect(new URL("/", request.url));

    /* Some edge cases */
    if(request.nextUrl.pathname.startsWith("/profile") && token.partner == false) return NextResponse.redirect(new URL("/", request.url));
    if(request.nextUrl.pathname.startsWith("/feed") && (token.role == "OUTSIDER")) return NextResponse.redirect(new URL("/", request.url));
  }

  // Auth paths
  // if signed in, user can't access /auth paths
  if (authRoutes.some((path) => request.nextUrl.pathname.startsWith(path))) {
    if (token) return NextResponse.redirect(new URL("/", request.url));
  }
}
