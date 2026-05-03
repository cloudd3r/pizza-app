import { prisma } from '@/prisma/prisma-client';

export interface GetSearchParams {
  query?: string;
  sortBy?: string;
  sizes?: string;
  pizzaTypes?: string;
  ingredients?: string;
  priceFrom?: string;
  priceTo?: string;
}

const DEFAULT_MIN_PRICE = 0;
const DEFAULT_MAX_PRICE = 1000;

const parseNumberList = (value?: string) => {
  const values = value
    ?.split(',')
    .map(Number)
    .filter((item) => Number.isFinite(item) && item > 0);

  return values?.length ? values : undefined;
};

export const findPizzas = async (params: GetSearchParams) => {
  const sizes = parseNumberList(params.sizes);
  const pizzaTypes = parseNumberList(params.pizzaTypes);
  const ingredientsIdArr = parseNumberList(params.ingredients);

  const minPrice = Number(params.priceFrom) || DEFAULT_MIN_PRICE;
  const maxPrice = Number(params.priceTo) || DEFAULT_MAX_PRICE;

  const categories = await prisma.category.findMany({
    include: {
      products: {
        orderBy: {
          id: 'desc',
        },
        include: {
          ingredients: true,
          items: {
            orderBy: {
              price: 'asc',
            },
          },
        },
      },
    },
    orderBy: {
      id: 'asc',
    },
  });

  return categories.map((category) => ({
    ...category,
    products: category.products
      .map((product) => {
        const matchesIngredients =
          !ingredientsIdArr?.length ||
          product.ingredients.some((ingredient) =>
            ingredientsIdArr.includes(ingredient.id),
          );

        return {
          ...product,
          items: matchesIngredients
            ? product.items.filter((item) => {
                const matchesPrice =
                  item.price >= minPrice && item.price <= maxPrice;
                const matchesSize =
                  !sizes?.length ||
                  (item.size !== null && sizes.includes(item.size));
                const matchesPizzaType =
                  !pizzaTypes?.length ||
                  (item.pizzaType !== null &&
                    pizzaTypes.includes(item.pizzaType));

                return matchesPrice && matchesSize && matchesPizzaType;
              })
            : [],
        };
      })
      .filter((product) => product.items.length > 0),
  }));
};
