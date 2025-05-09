import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import OrientationHandler from './components/OrientationHandler';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Periodic Table of the Elephants',
  description: 'Interactive periodic table with elephant images for each element',
  viewport: 'width=device-width, initial-scale=1.0, viewport-fit=cover, user-scalable=yes, maximum-scale=5',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta httpEquiv="ScreenOrientation" content="autoRotate:disabled" />
        <meta name="screen-orientation" content="landscape" />
      </head>
      <body className={inter.className}>
        <div className="mobile-notice">
          <div className="flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
            For the best experience, please rotate your device
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
          </div>
        </div>
        <OrientationHandler />
        <main className="min-h-screen py-4 relative z-10">
          <div className="backdrop-blur-[1px] bg-white/60 dark:bg-black/60 rounded-xl mx-auto">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}