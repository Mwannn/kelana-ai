import './globals.css';
import type { Metadata } from 'next';
import Cursor from './components/Cursor';

export const metadata: Metadata = {
  title: 'Kelana AI — Perjalanan Tak Terlupakan ke Nusantara',
  description: 'Perjalanan yang dirancang oleh orang yang pulang ke rumah.',
  icons: {
    icon: '/logo-kelanaai.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,600;0,9..144,800;0,9..144,900;1,9..144,300;1,9..144,400;1,9..144,800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body>
        <Cursor />
        {children}
      </body>
    </html>
  );
}
