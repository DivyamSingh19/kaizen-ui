import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css"
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "sonner";
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kaizen",
  description: "Autonomous smart contract security and monitoring platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark h-full ${inter.variable} ${spaceGrotesk.variable}`}>
      <body
        className={`antialiased h-full`}
      >
        <TooltipProvider>
          
            {children}
       
          <Toaster position="top-right" />
        </TooltipProvider>
      </body>
    </html>
  );
}
