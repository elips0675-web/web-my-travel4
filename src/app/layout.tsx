import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Compass, PlusCircle } from 'lucide-react';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import './globals.css';

export const metadata = {
  title: 'Путевой Компас',
  description: 'Ваш AI-помощник для планирования путешествий',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Alegreya:wght@400;500;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn('font-body antialiased min-h-screen bg-background')}>
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <Compass className="h-6 w-6 text-primary" />
              <span className="font-headline text-lg font-bold text-primary">Путевой Компас</span>
            </Link>
            <nav className="hidden md:flex items-center gap-4">
              <Link href="/tours" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                Поиск Туров
              </Link>
              <Link href="/housing" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                Аренда Жилья
              </Link>
            </nav>
          </div>
          <Button asChild>
            <Link href="/routes/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              Новый маршрут
            </Link>
          </Button>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}
