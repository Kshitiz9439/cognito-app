import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AppLayout } from '@/components/app-layout';
import { Footer } from '@/components/footer'; // ✅ add this

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Cognito',
  description: 'An intelligent AI assistant for chat, summarization, and creative writing.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AppLayout>
          {children}
          <Footer /> {/* ✅ this shows your name at the bottom */}
        </AppLayout>
        <Toaster />
      </body>
    </html>
  );
}
