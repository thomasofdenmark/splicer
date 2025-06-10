import '@/app/ui/global.css';
import { SessionProvider } from 'next-auth/react';
import { Metadata } from 'next';
import TopNavigation from '@/app/ui/top-navigation';

import { body } from '@/app/ui/fonts';

export const metadata: Metadata = {
  title: {
    template: '%s | Splicer Dashboard',
    default: 'Splicer Dashboard',
  },
  description: 'The best group buying platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${body.className} antialiased`}>
        <SessionProvider>
          <TopNavigation />
          <main>
            {children}
          </main>
        </SessionProvider>
      </body>
    </html>
  );
}
