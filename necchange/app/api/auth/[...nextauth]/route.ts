import NextAuth from 'next-auth/next'
import { authOptions } from '@/app/lib/authOptions';
import { NextApiRequest, NextApiResponse } from 'next';

//const handler = NextAuth(authOptions)

export async function GET(req: NextApiRequest, res: NextApiResponse) {
    if(req.url && req.method === "HEAD") {
        return res.status(200).end()
    }

    return NextAuth(req, res, authOptions)
}

export async function POST(req: NextApiRequest, res: NextApiResponse) {
    if(req.url && req.method === "HEAD") {
        return res.status(200).end()
    }

    return NextAuth(req, res, authOptions)
}

//export { auth as POST }