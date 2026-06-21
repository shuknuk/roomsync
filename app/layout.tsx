import type { Metadata, Viewport } from "next";
import { Comfortaa } from "next/font/google";
import "./globals.css";

const comfortaa = Comfortaa({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-comfortaa",
});

export const metadata: Metadata = {
  title: "Roomora",
  description:
    "This web application streamlines project management for teams, offering intuitive task tracking, collaboration tools, and progress visualization to enhance productivity.",
};

export const viewport: Viewport = {
  themeColor: "#443143",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${comfortaa.variable}`}>
        {children}
      </body>
    </html>
  );
}
