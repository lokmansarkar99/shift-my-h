/**
 * House Move - Step 3 Access Component
 * Wrapper for Step 3 Pricing
 */

import React from 'react';
import { HouseMoveQuote } from './houseMoveTypes';
import { Step3Pricing } from './HouseMoveStep3Pricing';

interface Props {
  data: HouseMoveQuote;
  onChange: (updates: Partial<HouseMoveQuote>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function HouseMoveStep3Access({ data, onChange, onNext, onBack }: Props) {
  return <Step3Pricing data={data} onChange={onChange} onNext={onNext} onBack={onBack} />;
}
