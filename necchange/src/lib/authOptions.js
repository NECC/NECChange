import NextAuth from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { createClient } from "@supabase/supabase-js";
import { createTransport } from "nodemailer";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Custom adapter for token management and user lookup
const customAdapter = {
  async createVerificationToken(verificationToken) {
    console.log("Creating verification token:", {
      identifier: verificationToken.identifier,
      token: verificationToken.token,
      expires: verificationToken.expires,
    });

    const { data, error } = await supabase
      .from("verification_tokens")
      .insert({
        identifier: verificationToken.identifier,
        token: verificationToken.token,
        expires: verificationToken.expires.toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating verification token:", error);
      throw error;
    }

    console.log("Token created successfully:", data);
    return {
      identifier: data.identifier,
      token: data.token,
      expires: new Date(data.expires),
    };
  },

  async useVerificationToken({ identifier, token }) {
    console.log("Attempting to use verification token:", { identifier, token });

    const { data, error } = await supabase
      .from("verification_tokens")
      .select("*")
      .eq("identifier", identifier)
      .eq("token", token)
      .single();

    console.log("Token lookup result:", { data, error });

    if (error || !data) {
      console.log("Token not found or error occurred");
      return null;
    }

    const tokenExpires = new Date(data.expires);
    const now = new Date();

    console.log("Token expiry check:", {
      tokenExpires: tokenExpires.toISOString(),
      now: now.toISOString(),
      isExpired: tokenExpires < now,
    });

    // Check if token is expired
    if (tokenExpires < now) {
      console.log("Token has expired");
      // Delete expired token
      await supabase
        .from("verification_tokens")
        .delete()
        .eq("identifier", identifier)
        .eq("token", token);
      return null;
    }

    // Delete the token after successful use
    const { error: deleteError } = await supabase
      .from("verification_tokens")
      .delete()
      .eq("identifier", identifier)
      .eq("token", token);

    if (deleteError) {
      console.error("Error deleting token:", deleteError);
    }

    console.log("Token used successfully");
    return {
      identifier: data.identifier,
      token: data.token,
      expires: new Date(data.expires),
    };
  },

  async getUserByEmail(email) {
    const { data, error } = await supabase
      .from("user")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !data) return null;

    return {
      id: data.uniqueid.toString(),
      email: data.email,
      name: data.name,
      emailVerified: null,
    };
  },

  async updateUser(user) {
    // NextAuth calls this to update emailVerified after successful sign in
    // Since we're using JWT and don't need emailVerified tracking, just return the user
    console.log("updateUser called with:", user);
    return user;
  },
};

export const authOptions = {
  adapter: customAdapter,
  pages: {
    signIn: "/auth/signin",
    signOut: "/",
    verifyRequest: "/auth/verify-request",
  },
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
      maxAge: 15 * 60, // 15 minutes
      generateVerificationToken: () =>
        Math.floor(1000 + Math.random() * 9000).toString(),
      sendVerificationRequest,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
  callbacks: {
    async signIn({ user }) {
      // Verify user exists in your custom user table
      const { data: existingUser, error } = await supabase
        .from("user")
        .select("*")
        .eq("email", user.email)
        .single();

      if (error || !existingUser) {
        console.log("User not found in database:", user.email);
        return false; // Reject sign in if user doesn't exist
      }

      return true;
    },

    async jwt({ token, user, trigger, account }) {
      // If token doesn't have email yet, fetch user data by ID
      if (!token.email && token.sub) {
        console.log("Fetching user data by ID:", token.sub);

        const { data, error } = await supabase
          .from("user")
          .select("*")
          .eq("uniqueid", parseInt(token.sub))
          .single();

        if (error) {
          console.error("Error fetching user data by ID:", error);
          return token;
        }

        if (data) {
          console.log("User data loaded by ID:", data);
          token.id = data.uniqueid;
          token.role = data.role || "OUTSIDER";
          token.name = data.name;
          token.email = data.email;
          token.partner = data.partner;
          token.partnernumber = data.partnernumber;
          token.number = data.number;
        }
        return token;
      }

      // On sign in or update, fetch user data from your custom table
      if (account || user?.email || trigger === "update") {
        const email = user?.email || token.email;

        if (!email) {
          console.error("No email found in token or user");
          return token;
        }

        console.log("Fetching user data for:", email);

        const { data, error } = await supabase
          .from("user")
          .select("*")
          .eq("email", email)
          .single();

        if (error) {
          console.error("Error fetching user data:", error);
          return token;
        }

        if (data) {
          console.log("User data loaded:", data);
          token.id = data.uniqueid;
          token.role = data.role || "OUTSIDER";
          token.name = data.name;
          token.email = data.email;
          token.partner = data.partner;
          token.partnernumber = data.partnernumber;
          token.number = data.number;
        }
      }
      return token;
    },

    async session({ session, token }) {
      // Pass user data to the session
      console.log("Session callback - token:", token);

      session.user = {
        id: token.id,
        name: token.name,
        email: token.email,
        role: token.role,
        partner: token.partner,
        partnernumber: token.partnernumber,
        number: token.number,
      };

      console.log("Session callback - session.user:", session.user);
      return session;
    },
  },
  session: { strategy: "jwt" },
};

async function sendVerificationRequest(params) {
  const file = process.cwd() + "/neccSticker.png";
  const { identifier, token, provider, theme } = params;
  const transport = createTransport(provider.server);

  const result = await transport.sendMail({
    to: identifier,
    from: provider.from,
    subject: `NECChange Authentication Code: ${token}`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f9f9f9; font-family: Helvetica, Arial, sans-serif;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f9f9f9;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 10px; overflow: hidden; max-width: 100%;">
          <!-- Logo Section -->
          <tr>
            <td align="center" style="padding: 40px 20px; background-color: #ffffff;">
              <img src="cid:unique@nodemailer.com" alt="NECChange Logo" width="150" height="150" style="display: block; border: 0;">
            </td>
          </tr>
          <!-- Content Section -->
          <tr>
            <td style="padding: 0 40px 20px 40px;">
              <h2 style="color: #333333; font-size: 24px; margin: 0 0 20px 0; font-weight: 600;">Dear Student,</h2>
              <p style="color: #666666; font-size: 16px; line-height: 24px; margin: 0 0 30px 0;">
                To enhance your account security, we require a quick verification process. Please type the following code into your sign-in form to proceed:
              </p>
            </td>
          </tr>
          <!-- Code Section -->
          <tr>
            <td align="center" style="padding: 0 40px 30px 40px;">
              <table border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="background-color: #f0f4ff; border: 2px solid #346df1; border-radius: 8px; padding: 20px 40px;">
                    <span style="font-size: 32px; font-weight: bold; color: #346df1; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                      ${token}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Expiry Notice -->
          <tr>
            <td align="center" style="padding: 0 40px 20px 40px;">
              <p style="color: #999999; font-size: 14px; margin: 0;">
                This code expires in <strong>15 minutes</strong>
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px 40px 40px; border-top: 1px solid #eeeeee;">
              <p style="color: #999999; font-size: 14px; line-height: 20px; margin: 0;">
                If you did not request this email, you can safely ignore it.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
    attachments: [
      {
        filename: "neccSticker.png",
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

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }; 