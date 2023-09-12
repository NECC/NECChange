import { NextRequest, NextResponse } from "next/server";
import { adminRoutes, authRoutes, protectedRoutes } from "./app/routes/routes";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request });
    const userAgent = request.headers.get('user-agent');

    // Block HEAD requests from Outlook
    if (request.method === 'HEAD' && userAgent && userAgent.includes('Outlook')) {
        return new Response(null, { status: 200 }); // Return a 403 Forbidden response
    }

    // Admin paths
    if (adminRoutes.some((path) => request.nextUrl.pathname.startsWith(path))) {
        if (!token || token.role != 'SUPER_USER') return NextResponse.redirect(new URL('/', request.url));
    }

    // Protected paths
    if (protectedRoutes.some((path) => request.nextUrl.pathname.startsWith(path))) {
        if (!token) return NextResponse.redirect(new URL('/', request.url));
    }

    // Auth paths
    if (authRoutes.some((path) => request.nextUrl.pathname.startsWith(path))) {
        if (token) return NextResponse.redirect(new URL('/', request.url));
    }
}
