import type { Metadata } from 'next';
import { Fira_Code, Inter } from 'next/font/google';
import ReduxProvider from '@/store/provider';
import StyledThemeProvider from '@/styles/provider';
import Footer from '@/shared/Footer/Footer';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import '@/styles/globals.css';

const firaCode = Fira_Code({
  variable: '--font-family-fira-code',
  subsets: ['latin'],
  display: 'swap',
  adjustFontFallback: false
});

const inter = Inter({
  variable: '--font-family-inter',
  subsets: ['latin'],
  display: 'swap',
  adjustFontFallback: false
});

export const metadata: Metadata = {
  title: 'Joaquin Godoy',
  description: 'Software Engineer'
};

const RootLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <html lang="en">
      <body className={`${firaCode.variable} ${inter.variable}`}>
        <StyledThemeProvider>
          <ReduxProvider>
            <main>{children}</main>
            <Footer />
          </ReduxProvider>
        </StyledThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
