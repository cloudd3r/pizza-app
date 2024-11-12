'use client';

import React from 'react';
import { Title } from './title';
import { FilterCheckbox } from './filter-checkbox';
import { Input } from '../ui';
import { RangeSlider } from './range-slider';
import { CheckboxFiltersGroup } from './checkbox-filters-group';
import { useFilterIngredients } from '@/hooks/useFilterIngredients';

interface Props {
  className?: string;
}

export const Filters: React.FC<Props> = ({ className }) => {
  const { ingredients, loading, selectedIds, onAddId } = useFilterIngredients();

  const items = ingredients.map((ingredient) => ({
    text: ingredient.name,
    value: String(ingredient.id),
  }));

  return (
    <div className={className}>
      <Title text='Фильтры' size='sm' className='font-extrabold mb-5' />

      <div className='flex flex-col gap-4'>
        <FilterCheckbox name='qwe' text='Можно собрать' value='1' />
        <FilterCheckbox name='ewq' text='Новые' value='2' />
      </div>

      <div className='flex flex-col gap-5 mt-5 border-y border-y-neutral-100 py-6 pb-7'>
        <p className='font-bold'>Цена от и до:</p>
        <div className='flex gap-3'>
          <Input type='number' placeholder='0' min={0} max={1000} />
          <Input type='number' min={100} max={1000} placeholder='1000' />
        </div>

        <RangeSlider min={0} max={1000} step={10} value={[0, 1000]} />

        <CheckboxFiltersGroup
          title='Ингредиенты'
          limit={5}
          items={items}
          defaultItems={items.slice(0, 5)}
          loading={loading}
          onClickChange={onAddId}
          selectedIds={selectedIds}
        />
      </div>
    </div>
  );
};
