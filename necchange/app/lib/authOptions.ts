import { NextAuthOptions } from 'next-auth'
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
  
    pages: {
      signIn: "/auth/signin",
      signOut: "/"
    },
    providers: [
      EmailProvider({
        server: process.env.EMAIL_SERVER,
        from: process.env.EMAIL_FROM,
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    debug: true,
  
    callbacks: {
      async jwt({token, user}: any){
        return {...token, ...user};
      },
      
      async session({ session, token }: any) {
        // Add role to session provided from useSession
        session.user.role = token.role
        session.user.number = token.number
  
        return session
      },   
    },
    session: { strategy: "jwt", maxAge: 365* 24 * 60 * 60 },
    events: {
    }
  
  }