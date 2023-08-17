import NextAuth from 'next-auth'
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

export const authOptions = {
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
    async jwt({token, user}){
      return {...token, ...user};
    },
    
    async session({ session, token }) {
      // Add role to session provided from useSession
      session.user.role = token.role
      session.user.number = token.number

      return session
    },   
  },
  session: { strategy: "jwt" },
  events: {
  }

}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }