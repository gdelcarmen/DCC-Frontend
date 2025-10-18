import type { Metadata } from "next";
import { Work_Sans, Source_Sans_3 } from "next/font/google";
import { Providers } from "./providers";

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-work-sans",
  display: "swap"
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans",
  display: "swap"
});

export const metadata: Metadata = {
  metadataBase: new URL("https://delcarmenconsulting.com"),
  title: {
    default: "Del Carmen Consulting",
    template: "%s | Del Carmen Consulting"
  },
  description:
    "Empowering public safety agencies with data-driven insights, compliance expertise, and community-centered strategy.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png"
  },
  openGraph: {
    type: "website",
    title: "Del Carmen Consulting",
    description:
      "Partnering with agencies to deliver equitable outcomes through training, analytics, and consent-driven engagement.",
    url: "https://delcarmenconsulting.com",
    siteName: "Del Carmen Consulting"
  },
  twitter: {
    card: "summary_large_image",
    title: "Del Carmen Consulting",
    description:
      "Partnering with agencies to deliver equitable outcomes through training, analytics, and consent-driven engagement."
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${workSans.variable} ${sourceSans.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
