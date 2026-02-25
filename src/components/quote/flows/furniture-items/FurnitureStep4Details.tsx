/**
 * Furniture & Items - Step 4: Date & Time
 * Wrapper for Step 4 DateTime
 */

import React from 'react';
import { FurnitureQuote } from './furnitureTypes';
import { FurnitureStep4DateTime } from './FurnitureStep4DateTime';

interface StepProps {
  data: FurnitureQuote;
  onChange: (updates: Partial<FurnitureQuote>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function FurnitureStep4Details({ data, onChange, onNext, onBack }: StepProps) {
  return <FurnitureStep4DateTime data={data} onChange={onChange} onNext={onNext} onBack={onBack} />;
}