import type { Metadata, Viewport } from "next";
import { Outfit, Space_Grotesk } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const title = "Join the City Boy Movement | Plateau State Registration";
const description =
  "Register as a member of the City Boy Movement in Plateau State. Sign up with your LGA, ward and polling unit to take part in membership, mobilisation and electoral organising.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: title, template: "%s | City Boy Movement" },
  description,
  applicationName: "City Boy Movement",
  keywords: [
    "City Boy Movement",
    "CBM",
    "Plateau State",
    "Nigeria",
    "member registration",
    "join the movement",
    "voter mobilisation",
    "polling unit",
    "Renewed Hope",
    "APC",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: "/",
    siteName: "City Boy Movement",
    title,
    description,
    images: [{ url: "/logos/city-boy.png", alt: "City Boy Movement logo" }],
  },
  twitter: {
    card: "summary",
    title,
    description,
    images: ["/logos/city-boy.png"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F7F7F9" },
    { media: "(prefers-color-scheme: dark)", color: "#020402" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
