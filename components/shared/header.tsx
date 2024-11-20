import React from 'react';
import { Container } from './container';
import Image from 'next/image';
import Link from 'next/link';
import { SearchInput } from './search-input';
import { CartButton } from './cart-button';
import { cn } from '@/lib/utils';
import { Button } from '../ui';
import { User } from 'lucide-react';

interface Props {
  hasCart?: boolean;
  hasSearch?: boolean;
  className?: string;
}

export const Header: React.FC<Props> = ({ className, hasCart, hasSearch }) => {
  return (
    <header className={cn('border-b', className)}>
      <Container className='flex items-center justify-between py-8'>
        <Link href='/'>
          <div className='flex items-center gap-4'>
            <Image src='/logo.png' alt='Logo' width={32} height={32} />
            <div>
              <h1 className='text-2xl uppercase font-black'>Next Pizza</h1>
              <p className='text-sm text-gray-500 leading-3'>
                вкусней уже некуда
              </p>
            </div>
          </div>
        </Link>

        {hasSearch && (
          <div className='mx-10 flex-1'>
            <SearchInput />
          </div>
        )}

        <div className='flex items-center gap-3'>
          <Button variant='outline' className={cn('group relative', className)}>
            <User size={16} />
            Войти
          </Button>

          {hasCart && <CartButton />}
        </div>
      </Container>
    </header>
  );
};
