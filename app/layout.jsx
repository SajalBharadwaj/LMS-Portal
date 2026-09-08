import './globals.css';
import { LMSProvider } from '../context/LMSContext';

export const metadata = {
  title: 'Apex University | Academic LMS Portal',
  description:
    'Comprehensive Academic Learning & Management System for Apex University scholars, faculty, and administrative leadership.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen transition-colors duration-200 antialiased selection:bg-indigo-500 selection:text-white">
        <LMSProvider>{children}</LMSProvider>
      </body>
    </html>
  );
}
