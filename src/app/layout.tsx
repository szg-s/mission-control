import type { Metadata } from 'next';
import './globals.css';
import DemoBanner from '@/components/DemoBanner';
import { I18nProvider } from '@/lib/i18n';

export const metadata: Metadata = {
  title: 'Mission Control - 任务控制中心',
  description: 'AI Agent 任务调度面板',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="bg-mc-bg text-mc-text min-h-screen">
        <I18nProvider>
          <DemoBanner />
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
