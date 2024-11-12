import { Ingredient } from '@prisma/client';
import React from 'react';
import { useState } from 'react';
import { useSet } from 'react-use';

interface ReturnProps {
  ingredients: Ingredient[];
  loading: boolean;
  selectedIds: Set<string>;
  onAddId: (id: string) => void;
}

export const useFilterIngredients = (): ReturnProps => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(false);

  const [selectedIds, { toggle }] = useSet(new Set<string>([]));

  React.useEffect(() => {
    const fetchIngredients = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/ingredients');
        const data = await response.json();
        setIngredients(data);
      } catch (error) {
        console.error('Error fetching ingredients:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchIngredients();
  }, []);

  return { ingredients, loading, selectedIds, onAddId: toggle };
};
