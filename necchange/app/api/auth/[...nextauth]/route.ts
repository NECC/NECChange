import NextAuth from 'next-auth'
import { authOptions } from '@/app/lib/authOptions';

import { NextResponse } from 'next/server'

const handler = NextAuth(authOptions)

const fuckAll = NextResponse.json({}, {status: 200})

export { handler as GET, handler as POST, fuckAll as HEAD }