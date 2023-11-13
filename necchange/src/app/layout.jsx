import "./globals.css";
import "@radix-ui/themes/styles.css";
import Navbar from "@/components/globals/navbar/Navbar";
import Provider from "@/components/Provider";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth/next";
import { Inter } from "next/font/google";
import { Theme, ThemePanel } from "@radix-ui/themes";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "NECChange",
  description: "necchange is a website where students can see their test calendar and where they can access their membership card.",
  content: "necchange is a website where students can see their test calendar and where they can access their membership card."
};

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions);

  console.log("Session", session);
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider>
          <Theme appearance="light" accentColor="blue">
            <Navbar session={session} />
            {children}
          </Theme>
        </Provider>
      </body>
    </html>
  );
}
