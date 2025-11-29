import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { ToastProvider } from '@/components/providers/ToastProvider';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import ClientComponents from '@/components/ClientComponents';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Vaultheir™ - Revolutionary IP Management Platform',
  description: 'Protect your intellectual property 90% faster and 95% cheaper with blockchain-powered notarization on Hedera Hashgraph.',
  keywords: ['IP management', 'blockchain', 'Hedera Hashgraph', 'intellectual property', 'patents', 'trademarks', 'copyright'],
  authors: [{ name: 'BidayaX LLC' }],
  manifest: '/manifest.json',
  themeColor: '#0a0a0a',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'VaultHeir',
  },
  openGraph: {
    title: 'Vaultheir™ - Revolutionary IP Management Platform',
    description: 'Blockchain-powered IP notarization on Hedera Hashgraph',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vaultheir™ - Revolutionary IP Management Platform',
    description: 'Blockchain-powered IP notarization on Hedera Hashgraph',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <ThemeProvider>
          <ToastProvider>
            <ClientComponents />
            {children}
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

