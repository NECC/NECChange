import { NextRequest, NextResponse } from "next/server";
import { adminRoutes, authRoutes, protectedRoutes } from "./app/routes/routes";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });

  console.log('Request', request);
  console.log('My token middleware:', token);

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
  }

  // Auth paths
  // if signed in, user can't access /auth paths
  if (authRoutes.some((path) => request.nextUrl.pathname.startsWith(path))) {
    if (token) return NextResponse.redirect(new URL("/", request.url));
  }
}
