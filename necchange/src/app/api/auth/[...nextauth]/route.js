import NextAuth from "next-auth";
import { authOptions } from "@/lib/authOptions";

const handler = async (req, context) => {
  //console.log("handler\n",req,  req.method, "\n", req.headers.get("host"));

  if (req.headers.get("host").includes("csp") || req.headers.get("host").includes("eur03.safelinks")) {
    return new Response(null, { status: 200 });
  }

  return await NextAuth(req, context, authOptions);
};

export { handler as GET, handler as POST, handler as HEAD };
