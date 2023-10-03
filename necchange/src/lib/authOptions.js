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
  
  // Isso daqui é so um teste, é gambiarra e acho melhor tirar ou testar mais vezes
  const file2 = process.cwd() + '/neccSticker.png';
  // const file = __dirname.split("/");
  // if (file[file.length - 1] == "[...nextauth]") {
  //   file.pop();
  //   file.push("signin");
  // }
  // const finalFile = file.join("/") + '/neccSticker.png';

  // console.log("FILEEEE: ", file);
  // console.log("FILEEEE: ", file.join("/"));
  // console.log("FILE2: ", process.cwd() + '/neccSticker.png');

  const { identifier, url, provider, theme } = params;
  const { host } = new URL(url);
  // NOTE: You are not required to use `nodemailer`, use whatever you want.
  const transport = createTransport(provider.server);
  const result = await transport.sendMail({
    to: identifier,
    from: provider.from,
    subject: `Sign in to ${host}`,
    text: text({ url, host }),
    html: `<body>
    <div style="width: 100%; display: flex; justify-content: center; align: center;"> 
      <img height={200} width={200} src="cid:unique@nodemailer.com"/> 
    <div> <br/> 
      ${html({ url, host, theme })}
    </body>`,
    attachments: [{
        filename: 'image.png',
        path: file2,
        cid: 'unique@nodemailer.com' //same cid value as in the html img src
    }],
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
  const { url, host, theme } = params;

  const escapedHost = host.replace(/\./g, "&#8203;.");

  const brandColor = theme.brandColor || "#346df1";
  const color = {
    background: "#f9f9f9",
    text: "#444",
    mainBackground: "#fff",
    buttonBackground: brandColor,
    buttonBorder: brandColor,
    buttonText: theme.buttonText || "#fff",
  };

  const redirect = process.env.NEXTAUTH_URL + "/auth/captcha?redirect=" + url

  return `
  <table width="100%" border="0" cellspacing="20" cellpadding="0"
    style="background: ${color.mainBackground
    }; max-width: 600px; margin: auto; border-radius: 10px;">
    <tr>
      <td>
    Dear <strong>@[User Name]</strong>, <br>
    Thank you for joining our community! To ensure the security of your account, we need to verify your email address.
    
    Please click the button below to confirm your email address: <td>
      </tr>
    <tr>
      <td align="center"
        style="padding: 10px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text
    };">
        Sign in to <strong>${escapedHost}</strong>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center" style="border-radius: 5px;" bgcolor="${color.buttonBackground
    }"><a href="${redirect}"
                target="_blank"
                style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${color.buttonText
    }; text-decoration: none; border-radius: 5px; padding: 10px 20px; border: 1px solid ${color.buttonBorder
    }; display: inline-block; font-weight: bold;">Sign
                in</a></td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td align="center"
        style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text
    };">
        If you did not request this email you can safely ignore it.
        <br>
      </td>
    </tr>
  </table>
`;
}

/** Email Text body (fallback for email clients that don't render HTML, e.g. feature phones) */
function text({ url, host }) {
  return `Sign in to ${host}\n${url}\n\n`;
}