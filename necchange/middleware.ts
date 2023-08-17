import { NextRequest, NextResponse } from "next/server";
import { getSession } from "next-auth/react";
import { adminRoutes, authRoutes, protectedRoutes } from "./app/routes/routes";
import { getToken } from "next-auth/jwt";

// OUTRAS FORMAS DE FAZER O MIDDLEWARE
/*
export default withAuth({
   callbacks: {
       authorized({ req, token }) {
             console.log("AAAAAAAAAAAAAAAAAAAAAA")
             console.log("Token: ", token);

             // `/super_user` requires admin role
             if (req.nextUrl.pathname === "/super_user") {
                 return token?.userRole === "admin"
             }
             // `/horario` and `/feed` only requires the user to be logged in
             return !!token
             return true;
         },
     },


    callbacks: {
        async authorized({ token, req }) {
    //         // Route protection
            const session = await getToken({
                req,
                secret: process.env.NEXTAUTH_SECRET,
                cookieName: process.env.NODE_ENV === 'production' ? '__Secure-next-auth.session-token' : 'next-auth.session-token'
            })
            const pathname = req.nextUrl.pathname
            const isAuth = !!token
            
            const notSensitiveRoutes = ['/', '/pricing', '/api/auth/signin', '/api/auth/callback/credentials', '/api/auth/session']
            
            console.log('token: ', token)
            console.log('session: ', session)
            console.log(req.cookies)
            
            if (!isAuth && !notSensitiveRoutes.some((route) => (pathname === route)) && pathname.startsWith('/api')) {
                return false
            } else if (!isAuth && !notSensitiveRoutes.some((route) => (pathname === route))) {
                return false
            }
            return true
        }
    }
})

export const config = { matcher: ["/horario", "/feed", "/super_user", "/super_user/users"]}
*/
export async function middleware(request: NextRequest) {
    /*

        Não usar o getSession, é usado no client side apenas
    */
    const session = await getSession();
    const token = await getToken({req: request});
    //console.log('My token middleware:', token);
    
    // Admin paths
    // if session and doesn't have role SUPER_USER, can't access /super_user
    if (adminRoutes.some((path) => request.nextUrl.pathname.startsWith(path))) {
        if (!session) return NextResponse.redirect(new URL('/', request.url));

        if (session?.user.role != 'SUPER_USER') {
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    // Protected paths
    // if not session, user can't access /horario and /feed
    if (protectedRoutes.some((path) => request.nextUrl.pathname.startsWith(path))) {
        // if (!session) return NextResponse.redirect(new URL('/', request.url));
        if (session) return NextResponse.redirect(new URL('/', request.url));
    }
    
    // Auth paths
    // if browser has session, user can't access /auth/signin
    if (authRoutes.some((path) => request.nextUrl.pathname.startsWith(path))) {
        if (session?.user) return NextResponse.redirect(new URL('/', request.url));
    }
}