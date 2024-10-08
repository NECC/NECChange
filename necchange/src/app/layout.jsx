import "./globals.css";
import Navbar from "@/components/globals/navbar/Navbar";
import Provider from "@/components/Provider";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth/next";
import { Inter } from "next/font/google";
import { NextUI } from "./nextui";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "NECChange",
  keyworks: ["NECC", "Ciências da Computação", "UMinho", "UM", "Universidade do Minho", "Calendario", "NECChange", "Testes", "Teste", "Socio"],
  description: "NECChange is a website where students can see their test calendar and where they can access their membership card.",
  content: "NECChange is a website where students can see their test calendar and where they can access their membership card."
};

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <head>
        <meta name="google-site-verification" content="HVpThFBdJ8PUXGD6k2itDm7qtdQvd9U0d4g3Is9qhr0" />
        <meta name="robots" content="index,follow" />
        <meta name="keywords" content="necchange, NECChange, Universidade do Minho, University of Minho, Departamento de Informática, NECC, necc" />
      </head>
      <body className={inter.className}>
        <Provider>
          <NextUI>
            <Navbar session={session} />
            {children}
          </NextUI>
        </Provider>
      </body>
    </html>
  );
}
