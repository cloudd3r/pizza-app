import { Container, GroupVariants, Title } from '@/components/shared';
import { ProductImage } from '@/components/shared/product-image';
import { prisma } from '@/prisma/prisma-client';
import { notFound } from 'next/navigation';

export default async function ProductPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const product = await prisma.product.findFirst({ where: { id: Number(id) } });

  if (!product) {
    return notFound();
  }

  return (
    <Container className='flex items-center my-10'>
      <ProductImage size={40} imageUrl={product.imageUrl} />

      <div className='w-[490px] bg-[#f7f6f5] p-7'>
        <Title className='mb-1 font-extrabold' text={product.name} size='lg' />

        <p className='text-gray-400'>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Delectus
          provident nulla et accusantium praesentium corporis voluptatem ipsa
          nobis explicabo maiores, quasi beatae ea, aspernatur eaque expedita
          aliquam a quam cupiditate.
        </p>

        <GroupVariants
          value='2'
          items={[
            {
              name: 'Маленькая',
              value: '1',
            },
            {
              name: 'Средняя',
              value: '2',
            },
            {
              name: 'Большая',
              value: '3',
            },
          ]}
        />
      </div>
    </Container>
  );
}
