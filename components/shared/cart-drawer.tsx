import React from 'react';

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import Link from 'next/link';
import { Button } from '../ui';
import { ArrowRight } from 'lucide-react';
import { CartDrawerItem } from './cart-drawer-item';
import { getCartItemDetails } from '@/lib/get-cart-item-details';

export const CartDrawer: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>

      <SheetContent className='flex flex-col justify-between pb-0 bg-[#F4F1EE]'>
        <SheetHeader>
          <SheetTitle>
            В корзине <span className='font-bold'>3 товара</span>
          </SheetTitle>
        </SheetHeader>

        <CartDrawerItem
          id={1}
          imageUrl={
            'https://media.dodostatic.net/image/r:233x233/11EE7D61304FAF5A98A6958F2BB2D260.webp'
          }
          details={getCartItemDetails(2, 30, [
            { name: 'Сыр' },
            { name: 'Сливочная моцарелла' },
          ])}
          name={' Пицца "Традиционная"'}
          price={419}
          quantity={1}
        />

        <SheetFooter className='-mx-6 bg-white p-8'>
          <div className='w-full'>
            <div className='flex mb-4'>
              <span className='flex flex-1 text-lg text-neutral-500'>
                Итого
                <div className='flex-1 border-b border-dashed border-b-neutral-200 relative -top-1 mx-2' />
              </span>

              <span className='font-bold text-lg'>500 ₽</span>
            </div>

            <Link href='/checkout'>
              <Button type='submit' className='w-full h-12 text-base'>
                Оформить заказ
                <ArrowRight className='w-5 ml-2' />
              </Button>
            </Link>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
