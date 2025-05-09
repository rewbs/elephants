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
        <div className="mobile-notice fixed top-0 left-0 right-0 z-50 bg-yellow-500 text-black py-2 px-4 text-center font-medium hidden">
          For the best experience, please rotate your device to landscape mode.
        </div>
        <OrientationHandler />
        <main className="min-h-screen py-8 relative z-10">
          <div className="backdrop-blur-[1px] bg-white/60 dark:bg-black/60 rounded-xl max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}