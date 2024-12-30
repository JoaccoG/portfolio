import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { ReduxProvider } from '@/store/provider';
import Footer from '@/shared/Footer/Footer';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
});

export const metadata: Metadata = {
  title: 'Joaquin Godoy',
  description: 'Software Engineer'
};

const RootLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ReduxProvider>{children}</ReduxProvider>
        <Footer />
      </body>
    </html>
  );
};

export default RootLayout;
