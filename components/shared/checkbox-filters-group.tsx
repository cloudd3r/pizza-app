'use client';

import React from 'react';
import { FilterCheckbox, FilterCheckboxProps } from './filter-checkbox';
import { Input } from '../ui';

type Items = FilterCheckboxProps;

interface Props {
  title: string;
  items: Items[];
  defaultItems: Items[];
  limit: number;
  searchPlaceholder?: string;
  onChange?: (values: string[]) => void;
  defaultValues?: string[];
  className?: string;
}

export const CheckboxFiltersGroup: React.FC<Props> = ({
  title,
  items,
  className,
  defaultValues,
  onChange,
  limit,
  searchPlaceholder = 'Поиск...',
  defaultItems,
}) => {
  const [showAll, setShowAll] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState('');

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const list = showAll
    ? items.filter((item) =>
        item.text.toLowerCase().includes(searchValue.toLowerCase())
      )
    : defaultItems.slice(0, limit);

  return (
    <div className={className}>
      <p className='font-bold mb-3'>{title}</p>

      {showAll && (
        <div className='mb-5'>
          <Input
            onChange={onChangeHandler}
            placeholder={searchPlaceholder}
            className='bg-gray-50 border-none'
          />
        </div>
      )}

      <div>
        {list.map((item, index) => (
          <FilterCheckbox
            key={index}
            text={item.text}
            value={item.value}
            endAdorment={item.endAdorment}
            onCheckedChange={item.onCheckedChange}
            chacked={false}
            className='mb-3'
          />
        ))}
      </div>

      {items.length > limit && (
        <div className={showAll ? 'border-t border-t-neutral-100 mt-4' : ''}>
          <button
            className='text-primary font-bold text-sm'
            onClick={() => {
              setShowAll(!showAll);
              setSearchValue('');
            }}
          >
            {showAll ? 'Скрыть' : '+ Показать все'}
          </button>
        </div>
      )}
    </div>
  );
};
