import { cn } from '@/lib/utils';
import { ArrowDownUp } from 'lucide-react';
import React from 'react';

interface Props {
  className?: string;
}

export const SortPopup: React.FC<Props> = ({ className }) => {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-3 bg-gray-50 p-1 px-5 rounded-2xl',
        className
      )}
    >
      <ArrowDownUp />
      <b className='h-11 py-3'>Сортировка:</b>
      <b className='text-primary h-11 py-3'>По популярности</b>
    </div>
  );
};
