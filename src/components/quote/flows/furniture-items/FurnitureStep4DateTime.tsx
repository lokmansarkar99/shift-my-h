/**
 * Furniture & Items - Step 4: Date & Time
 * REUSES House Move component
 */

import React from 'react';
import { FurnitureQuote } from './furnitureTypes';
import { Step4DateTime } from '../house-move/HouseMoveStep4DateTime';

interface Props {
  data: FurnitureQuote;
  onChange: (updates: Partial<FurnitureQuote>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function FurnitureStep4DateTime({ data, onChange, onNext, onBack }: Props) {
  // Convert FurnitureQuote to HouseMoveQuote format for compatibility
  const houseMoveData = {
    ...data,
    serviceType: 'house-move' as const,
  };

  return <Step4DateTime data={houseMoveData as any} onChange={onChange} onNext={onNext} onBack={onBack} />;
}
