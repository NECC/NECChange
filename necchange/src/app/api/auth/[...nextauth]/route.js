import NextAuth from "next-auth";
import { authOptions } from "@/lib/authOptions";

const handler = async (req, context) => {
  //console.log("NextAuth handler ->", req.url);

  if (req.method === "HEAD") {
    return new Response(null, { status: 200 });
  }

  // Macete para rejeitar emails vindos do postmaster, 
  // por algum motivo o postmaster insiste em chamar esta api com o arugmento "callbackUrl" que já não é utilizado,
  // mas que no entanto invalida o token de verificaçao.
  const url = new URL(req.url);
  const hasCallbackUrl = url.searchParams.has("callbackUrl");

  if (url.pathname === "/api/auth/callback/email" && hasCallbackUrl) {
    console.warn("Blocked automated request with callbackUrl:", url.searchParams.get("callbackUrl"));
    return new Response(null, { status: 200 });
  }

  return await NextAuth(req, context, authOptions);
};

export { handler as GET, handler as POST, handler as HEAD };

  