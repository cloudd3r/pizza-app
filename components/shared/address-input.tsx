'use client';

import React from 'react';
import { AddressSuggestions } from 'react-dadata';
import 'react-dadata/dist/react-dadata.css';

interface Props {
  onChange?: (value?: string) => void;
}

export const AdressInput: React.FC<Props> = ({ onChange }) => {
  return (
    <AddressSuggestions
      token='e79432bcfb5eeba8166a6245a2ab4bd6b31bc112'
      onChange={(data) => onChange?.(data?.value)}
    />
  );
};
