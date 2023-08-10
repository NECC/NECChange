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
    async session({ session, user }) {
      // Add role to session provided from useSession
      session.user.role = user.role
      session.user.number = user.number

      console.log("session.user", session.user);
      console.log("user", user);

      return session
    }
  },

  events: {
  }

}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }