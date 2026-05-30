import type { Metadata } from "next";
import { Cormorant_Garamond, Tiro_Telugu } from "next/font/google";
import Providers from "@/components/Providers";
import { LanguageProvider } from "@/components/LanguageProvider";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["400", "500", "600", "700"],
});

const tiroTelugu = Tiro_Telugu({
  subsets: ["telugu"],
  variable: "--font-telugu",
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Hindu Graveyard Construction — Donation Registry",
  description:
    "Donation registry for Hindu graveyard construction. విరాళాల నమోదు.",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${cormorant.variable} ${tiroTelugu.variable} min-h-screen bg-ivory font-sans text-text antialiased`}
      >
        <Providers>
          <LanguageProvider>{children}</LanguageProvider>
        </Providers>
      </body>
    </html>
  );
}
