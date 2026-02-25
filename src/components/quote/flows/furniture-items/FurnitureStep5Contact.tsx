/**
 * Furniture & Items - Step 5: Contact Details & Review
 * REUSES House Move component
 */

import React from 'react';
import { FurnitureQuote } from './furnitureTypes';
import { Step5Contact } from '../house-move/HouseMoveStep5Contact';

interface Props {
  data: FurnitureQuote;
  onChange: (updates: Partial<FurnitureQuote>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function FurnitureStep5Contact({ data, onChange, onNext, onBack }: Props) {
  // Convert FurnitureQuote to HouseMoveQuote format for compatibility
  const houseMoveData = {
    ...data,
    serviceType: 'house-move' as const,
  };

  return <Step5Contact data={houseMoveData as any} onChange={onChange} onNext={onNext} onBack={onBack} />;
}
