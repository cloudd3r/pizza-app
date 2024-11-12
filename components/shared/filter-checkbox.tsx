import React from 'react';
import { Checkbox } from '../ui';
import { cn } from '@/lib/utils';

export interface FilterCheckboxProps {
  text: string;
  value: string;
  endAdorment?: React.ReactNode;
  onCheckedChange?: (checked: boolean) => void;
  chacked?: boolean;
  className?: string;
  name?: string;
}

export const FilterCheckbox: React.FC<FilterCheckboxProps> = ({
  text,
  value,
  endAdorment,
  onCheckedChange,
  chacked,
  className,
  name,
}) => {
  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <Checkbox
        onCheckedChange={onCheckedChange}
        checked={chacked}
        value={value}
        className='rounded-[8px] w-6 h-6'
        id={`checkbox-${String(value)}-${String(name)}`}
      />
      <label
        className='leading-none cursor-pointer flex-1'
        htmlFor={`checkbox-${String(value)}-${String(name)}`}
      >
        {text}
      </label>
      {endAdorment}
    </div>
  );
};
