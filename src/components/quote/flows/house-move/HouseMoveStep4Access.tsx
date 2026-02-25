/**
 * House Move - Step 4 Access Component
 * Wrapper for Step 4 Date & Time
 */

import React from 'react';
import { HouseMoveQuote } from './houseMoveTypes';
import { Step4DateTime } from './HouseMoveStep4DateTime';

interface Props {
  data: HouseMoveQuote;
  onChange: (updates: Partial<HouseMoveQuote>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function HouseMoveStep4Access({ data, onChange, onNext, onBack }: Props) {
  return <Step4DateTime data={data} onChange={onChange} onNext={onNext} onBack={onBack} />;
}
