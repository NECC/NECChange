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
  title: "necchange",
  description: "necchange is a website where students can see their test calendar and where they can access their membership card.",
  content: "necchange, NECChange, Universidade do Minho, University of Minho, Departamento de Informática, NECC, necc",
};

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <head>
        <meta name="google-site-verification" content="HVpThFBdJ8PUXGD6k2itDm7qtdQvd9U0d4g3Is9qhr0" />
        <meta name="robots" content="index,follow" />
        <meta name="keywords" content="necchange, NECChange, Universidade do Minho, University of Minho, Departamento de Informática, NECC, necc"/>
      </head>
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
