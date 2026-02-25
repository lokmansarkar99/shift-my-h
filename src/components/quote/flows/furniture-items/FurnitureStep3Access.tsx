/**
 * Furniture & Items - Step 3: Access (Pricing)
 * Wrapper for Step 3 Pricing
 */

import React from 'react';
import { FurnitureQuote } from './furnitureTypes';
import { FurnitureStep3Pricing } from './FurnitureStep3Pricing';

interface StepProps {
  data: FurnitureQuote;
  onChange: (updates: Partial<FurnitureQuote>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function FurnitureStep3Access({ data, onChange, onNext, onBack }: StepProps) {
  return <FurnitureStep3Pricing data={data} onChange={onChange} onNext={onNext} onBack={onBack} />;
}