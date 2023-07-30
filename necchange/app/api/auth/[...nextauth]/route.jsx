import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import EmailProvider from "next-auth/providers/email";
import {PrismaAdapter} from '@next-auth/prisma-adapter';
import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

export const authOptions  = {
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
  pages: {
    signIn : "/auth/signin"
  }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }