import "./globals.css";
import Navbar from "./components/globals/navbar/Navbar";

export const metadata = {
  title: "NECChange",
  description: "A platform to display the activities calendar and let students easily swap class shifts ",
  
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
