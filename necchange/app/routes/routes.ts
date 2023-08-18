/**
 * Exports used in middleware.ts
 * 
 * The /auth/signin callback is '/'
 * 
 * @publicRoutes Anyone can access
 * @authRoutes Mustn't be signed in
 * @adminRoutes Must have SUPER_USER role in jwt token
 * @protectedRoutes Must be signed in
 * 
*/

export const publicRoutes = ['/'];
export const authRoutes = ['/auth'];
export const adminRoutes = ['/super_user'];
export const protectedRoutes = ['/horario', '/feed'];
