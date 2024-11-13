'use client';

import React from 'react';
import { FilterCheckbox, FilterCheckboxProps } from './filter-checkbox';
import { Input, Skeleton } from '../ui';

type Items = FilterCheckboxProps;

interface Props {
  title: string;
  items: Items[];
  defaultItems?: Items[];
  limit?: number;
  searchPlaceholder?: string;
  onClickChange?: (id: string) => void;
  defaultValues?: string[];
  className?: string;
  loading?: boolean;
  selectedIds: Set<string>;
  name?: string;
}

export const CheckboxFiltersGroup: React.FC<Props> = ({
  title,
  items,
  className,
  defaultValues,
  onClickChange,
  limit = 5,
  searchPlaceholder = 'Поиск...',
  defaultItems,
  loading,
  selectedIds,
  name,
}) => {
  const [showAll, setShowAll] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState('');

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  if (loading) {
    return (
      <div className={className}>
        <p className='font-bold mb-3'>{title}</p>

        {...Array(limit)
          .fill(0)
          .map((_, index) => (
            <Skeleton key={index} className='h-6 mb-3 rounded-[8px]' />
          ))}

        <Skeleton className='w-28 h-6 mb-3 rounded-[8px]' />
      </div>
    );
  }

  const list = showAll
    ? items.filter((item) =>
        item.text.toLowerCase().includes(searchValue.toLowerCase())
      )
    : (defaultItems || items).slice(0, limit);

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
            onCheckedChange={() => onClickChange?.(item.value)}
            chacked={selectedIds?.has(item.value)}
            className='mb-3'
            name={name}
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
