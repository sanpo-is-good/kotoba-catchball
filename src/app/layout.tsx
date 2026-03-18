import type { Metadata, Viewport } from 'next';
import './globals.css';
import { GameProvider } from '@/contexts/GameContext';

export const metadata: Metadata = {
  title: 'ひとことキャッチボール',
  description: '会話でスコアが貯まる！2人でリアルタイム会話ゲーム',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#1a5aa8',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body>
        <GameProvider>
          {children}
        </GameProvider>
      </body>
    </html>
  );
}
