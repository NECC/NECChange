import NextAuth from 'next-auth'
import { authOptions } from '@/app/lib/authOptions';
import { NextApiRequest, NextApiResponse } from 'next';

//const handler = NextAuth(authOptions)

export async function auth(req: NextApiRequest, res: NextApiResponse) {
    if(req.method === "HEAD") {
        return res.status(200).end()
     }

     return NextAuth(req, res, authOptions)
  }

export { auth as GET, auth as POST }