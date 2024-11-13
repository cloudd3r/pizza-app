import React, { use } from 'react';
import { Categories } from './categories';
import { SortPopup } from './sort-popup';
import { cn } from '@/lib/utils';
import { Container } from './container';
import { categories } from '@/prisma/constants';
import { Category } from '@prisma/client';

interface Props {
  categories: Category[];
  className?: string;
}

export const TopBar: React.FC<Props> = ({ className, categories }) => {
  return (
    <div
      className={cn(
        'w-full sticky top-0 bg-white py-5 shadow-lg shadow-black/5 z-10',
        className
      )}
    >
      <Container className='flex items-center justify-between'>
        <Categories items={categories} />
        <SortPopup />
      </Container>
    </div>
  );
};
