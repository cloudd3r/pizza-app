import {
  Container,
  Filters,
  ProductCard,
  ProductsGroupList,
  Title,
  TopBar,
} from '@/components/shared';

export default function Home() {
  return (
    <>
      <Container className='mt-10'>
        <Title text='Все пиццы' size='lg' className='font-extrabold' />
      </Container>

      <TopBar />

      <Container className='mt-10'>
        <div className='flex gap-[60px]'>
          <div className='w-[250px]'>
            <Filters />
          </div>

          <div>
            <div>
              <ProductsGroupList
                title='Пиццы'
                categoryId={1}
                items={[
                  {
                    id: 1,
                    name: 'Пипперони',
                    imageUrl:
                      'https://media.dodostatic.net/image/r:292x292/11EE7D612FC7B7FCA5BE822752BEE1E5.avif',
                    items: [{ price: 500 }],
                  },
                  {
                    id: 2,
                    name: 'Цыпленок',
                    imageUrl:
                      'https://media.dodostatic.net/image/r:292x292/11EE7D612FC7B7FCA5BE822752BEE1E5.avif',
                    items: [{ price: 300 }],
                  },
                  {
                    id: 3,
                    name: 'Моцарелла',
                    imageUrl:
                      'https://media.dodostatic.net/image/r:292x292/11EE7D612FC7B7FCA5BE822752BEE1E5.avif',
                    items: [{ price: 500 }],
                  },
                  {
                    id: 4,
                    name: 'Пепперони',
                    imageUrl:
                      'https://media.dodostatic.net/image/r:292x292/11EE7D612FC7B7FCA5BE822752BEE1E5.avif',
                    items: [{ price: 500 }],
                  },
                  {
                    id: 5,
                    name: 'Цыпленок',
                    imageUrl:
                      'https://media.dodostatic.net/image/r:292x292/11EE7D612FC7B7FCA5BE822752BEE1E5.avif',
                    items: [{ price: 300 }],
                  },
                  {
                    id: 6,
                    name: 'Моцарелла',
                    imageUrl:
                      'https://media.dodostatic.net/image/r:292x292/11EE7D612FC7B7FCA5BE822752BEE1E5.avif',
                    items: [{ price: 500 }],
                  },
                ]}
              />
              <ProductsGroupList
                title='Комбо'
                categoryId={2}
                items={[
                  {
                    id: 1,
                    name: 'Пипперони',
                    imageUrl:
                      'https://media.dodostatic.net/image/r:292x292/11EE7D612FC7B7FCA5BE822752BEE1E5.avif',
                    items: [{ price: 500 }],
                  },
                  {
                    id: 2,
                    name: 'Цыпленок',
                    imageUrl:
                      'https://media.dodostatic.net/image/r:292x292/11EE7D612FC7B7FCA5BE822752BEE1E5.avif',
                    items: [{ price: 300 }],
                  },
                  {
                    id: 3,
                    name: 'Моцарелла',
                    imageUrl:
                      'https://media.dodostatic.net/image/r:292x292/11EE7D612FC7B7FCA5BE822752BEE1E5.avif',
                    items: [{ price: 500 }],
                  },
                  {
                    id: 4,
                    name: 'Пепперони',
                    imageUrl:
                      'https://media.dodostatic.net/image/r:292x292/11EE7D612FC7B7FCA5BE822752BEE1E5.avif',
                    items: [{ price: 500 }],
                  },
                  {
                    id: 5,
                    name: 'Цыпленок',
                    imageUrl:
                      'https://media.dodostatic.net/image/r:292x292/11EE7D612FC7B7FCA5BE822752BEE1E5.avif',
                    items: [{ price: 300 }],
                  },
                  {
                    id: 6,
                    name: 'Моцарелла',
                    imageUrl:
                      'https://media.dodostatic.net/image/r:292x292/11EE7D612FC7B7FCA5BE822752BEE1E5.avif',
                    items: [{ price: 500 }],
                  },
                ]}
              />
              <ProductsGroupList
                title='Закуски'
                categoryId={3}
                items={[
                  {
                    id: 1,
                    name: 'Пипперони',
                    imageUrl:
                      'https://media.dodostatic.net/image/r:292x292/11EE7D612FC7B7FCA5BE822752BEE1E5.avif',
                    items: [{ price: 500 }],
                  },
                  {
                    id: 2,
                    name: 'Цыпленок',
                    imageUrl:
                      'https://media.dodostatic.net/image/r:292x292/11EE7D612FC7B7FCA5BE822752BEE1E5.avif',
                    items: [{ price: 300 }],
                  },
                  {
                    id: 3,
                    name: 'Моцарелла',
                    imageUrl:
                      'https://media.dodostatic.net/image/r:292x292/11EE7D612FC7B7FCA5BE822752BEE1E5.avif',
                    items: [{ price: 500 }],
                  },
                  {
                    id: 4,
                    name: 'Пепперони',
                    imageUrl:
                      'https://media.dodostatic.net/image/r:292x292/11EE7D612FC7B7FCA5BE822752BEE1E5.avif',
                    items: [{ price: 500 }],
                  },
                ]}
              />
              <ProductsGroupList
                title='Коктейли'
                categoryId={4}
                items={[
                  {
                    id: 1,
                    name: 'Пипперони',
                    imageUrl:
                      'https://media.dodostatic.net/image/r:292x292/11EE7D612FC7B7FCA5BE822752BEE1E5.avif',
                    items: [{ price: 500 }],
                  },
                  {
                    id: 2,
                    name: 'Цыпленок',
                    imageUrl:
                      'https://media.dodostatic.net/image/r:292x292/11EE7D612FC7B7FCA5BE822752BEE1E5.avif',
                    items: [{ price: 300 }],
                  },
                ]}
              />
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
