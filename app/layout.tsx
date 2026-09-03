import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://chansey-event-list.einarsvej-94-4436.chatgpt.site/';
const socialImageUrl = new URL('og.png', siteUrl).toString();
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const faviconUrl = `${basePath}/cards/base1-3.jpg`;

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Chansey Event List',
  description: 'A pocket checklist for the Chansey evolution-line collection.',
  icons: {
    icon: [{ url: faviconUrl, type: 'image/jpeg' }],
    shortcut: faviconUrl,
    apple: faviconUrl,
  },
  alternates: { canonical: siteUrl },
  openGraph: {
    title: 'Chansey Event List',
    description: 'A pocket checklist for trades and tables.',
    type: 'website',
    images: [{ url: socialImageUrl, width: 1728, height: 971, alt: 'Chansey Event List' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chansey Event List',
    description: 'A pocket checklist for trades and tables.',
    images: [socialImageUrl],
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
