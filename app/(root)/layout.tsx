import { Metadata } from 'next';
import { Header } from '@/components/shared/header';

export const metadata: Metadata = {
  title: 'Pizza App',
};

export default function HomeLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <main className='min-h-screen'>
      <Header hasSearch={true} hasCart={true} />
      {children}
      {modal}
    </main>
  );
}
