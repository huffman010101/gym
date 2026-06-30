import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'GymForge — AI-Powered Training & Nutrition',
  description: 'Personalised workout and meal plans built for your body and goals.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
