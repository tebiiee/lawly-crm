import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Sidebar } from '@/components/sidebar';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  title: 'Lawly',
  description: 'CRM Legal Avant-Garde',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.className} antialiased bg-background text-foreground flex min-h-screen selection:bg-foreground selection:text-background`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {/* Avant-Garde Minimal Sidebar */}
          <Sidebar />

          {/* Main Content Area */}
          <main className="flex-1 bg-background">
            <div className="max-w-6xl mx-auto p-8 md:p-16 animate-in fade-in duration-700">
              {children}
            </div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
