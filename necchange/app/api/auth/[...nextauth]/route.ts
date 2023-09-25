import NextAuth from "next-auth";
import { authOptions } from "@/app/lib/authOptions";

const handler = async (req: any, context: { params: any }) => {
//  console.log("handler\n", req.method, "\n", req.headers.get("host"));

  if (req.method === "HEAD") {
    return new Response(null, { status: 200 });
  }

  return await NextAuth(req, context, authOptions);
};

export { handler as GET, handler as POST, handler as HEAD };
