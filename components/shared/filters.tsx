import React from 'react';
import { Title } from './title';
import { FilterCheckbox } from './filter-checkbox';
import { Input } from '../ui';
import { RangeSlider } from './range-slider';
import { Check } from 'lucide-react';
import { CheckboxFiltersGroup } from './checkbox-filters-group';

interface Props {
  className?: string;
}

export const Filters: React.FC<Props> = ({ className }) => {
  return (
    <div className={className}>
      <Title text='Фильтры' size='sm' className='font-extrabold mb-5' />

      <div className='flex flex-col gap-4'>
        <FilterCheckbox text='Можно собрать' value='1' />
        <FilterCheckbox text='Новые' value='2' />
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
          items={[
            { text: 'Мясо', value: '1' },
            { text: 'Сыр', value: '2' },
            { text: 'Помидор', value: '3' },
            { text: 'Картофель', value: '4' },
            { text: 'Сыр', value: '5' },
            { text: 'Помидор', value: '6' },
            { text: 'Картофель', value: '7' },
            { text: 'Сыр', value: '8' },
          ]}
          defaultItems={[
            { text: 'Мясо', value: '1' },
            { text: 'Сыр', value: '2' },
            { text: 'Помидор', value: '3' },
            { text: 'Картофель', value: '4' },
            { text: 'Сыр', value: '5' },
            { text: 'Помидор', value: '6' },
            { text: 'Картофель', value: '7' },
            { text: 'Сыр', value: '8' },
          ]}
        />
      </div>
    </div>
  );
};
