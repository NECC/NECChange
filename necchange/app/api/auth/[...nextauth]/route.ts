import NextAuth from 'next-auth'
import { authOptions } from '@/app/lib/authOptions';
import { NextResponse, NextRequest } from 'next/server'

const handler = NextAuth(authOptions)

export async function HEAD(req: NextRequest, context: any) {
  return NextResponse.json({}, {status: 200})
}

export { handler as GET, handler as POST }