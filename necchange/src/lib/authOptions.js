import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
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
        const code = Math.floor(1000 + Math.random() * 9000); // random 6-digit code
        return code.toString();
      },
      sendVerificationRequest,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,

  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user };
    },

    async session({ session, token }) {
      // Add role to session provided from useSession
      session.user = token;
      //session.user.role = token.role
      //session.user.number = token.number

      return session;
    },
  },
  session: { strategy: "jwt" },
  events: {},
};

import { createTransport } from "nodemailer";

async function sendVerificationRequest(params) {
  const file = process.cwd() + "/neccSticker.png";

  const { identifier, url, token, provider, theme } = params;
  const { host } = new URL(url);

  // NOTE: You are not required to use `nodemailer`, use whatever you want.
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
        cid: "unique@nodemailer.com", //same cid value as in the html img src
        contentDisposition: "inline",
      },
    ],
  });
  const failed = result.rejected.concat(result.pending).filter(Boolean);
  if (failed.length) {
    throw new Error(`Email(s) (${failed.join(", ")}) could not be sent`);
  }
}

/**
 * Email HTML body
 * Insert invisible space into domains from being turned into a hyperlink by email
 * clients like Outlook and Apple mail, as this is confusing because it seems
 * like they are supposed to click on it to sign in.
 *
 * @note We don't add the email address to avoid needing to escape it, if you do, remember to sanitize it!
 */
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

/** Email Text body (fallback for email clients that don't render HTML, e.g. feature phones) */
function text({ url, host }) {
  return `Sign in to ${host}\n${url}\n\n`;
}
