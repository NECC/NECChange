import NextAuth from 'next-auth'
import EmailProvider from "next-auth/providers/email";
import {PrismaAdapter} from '@next-auth/prisma-adapter';
import {PrismaClient, Role} from '@prisma/client';

const prisma = new PrismaClient();

export const authOptions  = {
  adapter: PrismaAdapter(prisma),
  
  pages: {
    signIn : "/auth/signin",
    signOut : "/"
  },
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,

  events: {
    createUser: async ({user}) => {
      let role = null;

      if(user.email == process.env.EMAIL_SUPER_USER) role = Role.SUPER_USER
      else role = Role.STUDENT

      const new_user = await prisma.user.update({
        where:{
          email: user.email 
        },
        data:{
          role: role
        }
      })
    }
  }
  
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }