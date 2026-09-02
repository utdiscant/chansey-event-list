import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://chansey-event-list.einarsvej-94-4436.chatgpt.site'),
  title: 'Chansey Event List',
  description: 'A pocket checklist for the Chansey evolution-line collection.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Chansey Event List',
    description: 'A pocket checklist for trades and tables.',
    type: 'website',
    images: [{ url: '/og.png', width: 1728, height: 971, alt: 'Chansey Event List' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chansey Event List',
    description: 'A pocket checklist for trades and tables.',
    images: ['/og.png'],
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
