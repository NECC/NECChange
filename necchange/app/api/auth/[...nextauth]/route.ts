import NextAuth from "next-auth";
import { authOptions } from "@/app/lib/authOptions";
import { NextResponse } from "next/server";

const handler = async (req: any, context: { params: any }) => {
  console.log("handler", req.method);
  const domain = req.headers.get('host')

  console.log(domain);

  if(domain.includes('safelinks')){
    return NextResponse.json({status: 200})
  }

  return await NextAuth(req, context, authOptions);
};

export { handler as GET, handler as POST, handler as HEAD };