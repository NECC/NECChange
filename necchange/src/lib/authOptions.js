import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";

const prisma = new PrismaClient();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY 
);

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: "/auth/signin",
    signOut: "/",
  },
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
      generateVerificationToken: () => {
        const code = Math.floor(1000 + Math.random() * 9000);
        return code.toString();
      },
      sendVerificationRequest,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,

  callbacks: {
    async jwt({ token, user }) {
      console.log("=== JWT CALLBACK ===");
      console.log("User object:", user ?? "undefined");

      if (user && user.email) {
        try {
          console.log("Fetching from Supabase for email:", user.email);
  
          const { data: userData, error } = await supabase
            .from("user")
            .select("*")
            .eq("email", user.email)
            .single();
  
          console.log("Supabase response:", { userData, error });
  
          if (!error && userData) {
            console.log("Raw role from DB:", userData.role);
            console.log("Trimmed role:", userData.role?.trim());
  
            token.id = userData.uniqueid;
            token.uniqueId = userData.uniqueid;
            token.partnerNumber = userData.partnernumber;
            token.number = userData.number;
            token.phone = userData.phone;
            token.partner = userData.partner;
            token.role = userData.role?.trim() || "OUTSIDER";
            token.name = userData.name;
          } else {
            console.error("Error fetching user from Supabase:", error);
          }
        } catch (err) {
          console.error("Exception fetching user data:", err);
        }
      } else {
        console.log("Skipping Supabase fetch — no user (session refresh).");
      }
  
      console.log("Final token:", token);
      return token;
    },
  
    async session({ session, token }) {
      session.user = {
        id: token.id,
        uniqueId: token.uniqueId,
        name: token.name,
        email: token.email,
        role: token.role,
        partner: token.partner,
        partnerNumber: token.partnerNumber,
        number: token.number,
        phone: token.phone,
        emailVerified: token.emailVerified,
      };
  
      return session;
    },
  },
  session: { strategy: "jwt" },
};  

import { createTransport } from "nodemailer";

async function sendVerificationRequest(params) {
  const file = process.cwd() + "/neccSticker.png";

  const { identifier, url, token, provider, theme } = params;
  const { host } = new URL(url);

  const transport = createTransport(provider.server);
  const result = await transport.sendMail({
    to: identifier,
    from: provider.from,
    subject: `Authentication code: ${token}`,
    text: text({ url, host }),
    html: `
<div style="background-color:#f9f9f9;display:flex;justify-content:center;flex-direction:column;align-items:center">
  <div style="background-color:#fff ;width:70%;display:flex;justify-content:center">
    <img style="height:150px; width:150px" src="cid:unique@nodemailer.com"/> 
  </div>
  <div style="width:70% ;background-color:#fff">
    ${html({ url, token, host, theme })}
  </div>
</div>
    `,
    attachments: [
      {
        filename: "image.png",
        path: file,
        cid: "unique@nodemailer.com",
        contentDisposition: "inline",
      },
    ],
  });
  const failed = result.rejected.concat(result.pending).filter(Boolean);
  if (failed.length) {
    throw new Error(`Email(s) (${failed.join(", ")}) could not be sent`);
  }
}

function html(params) {
  const { url, token, host, theme } = params;

  const brandColor = theme.brandColor || "#346df1";
  const color = {
    text: "#444",
    mainBackground: "#fff",
    buttonBackground: brandColor,
    buttonBorder: brandColor,
    buttonText: theme.buttonText || "#fff",
  };

  return `
<body>
  <table width="100%" border="0" cellspacing="20" cellpadding="0"
    style="background: ${color.mainBackground}; max-width: 600px; margin: auto; border-radius: 10px;">
    <tr>
      <td style="font-size: 18px; font-family: Helvetica, Arial, sans-serif">
        <h5>Dear student,</h5>
        To enhance your account security, we require a quick verification process. Please type the following code into your sign in form to proceed:
      </td>
    </tr>
    <tr>
      <td align="center"
        style="padding: 10px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
        <strong>${token}</strong>
      </td>
    </tr>
    <tr>
      <td align="center"
        style="padding: 30px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
        If you did not request this email you can safely ignore it.
        <br>
      </td>
    </tr>
  </table>
</body>
  `;
}

function text({ url, host }) {
  return `Sign in to ${host}\n${url}\n\n`;
}