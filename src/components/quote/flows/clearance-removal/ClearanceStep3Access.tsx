import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { ClearanceQuote } from './clearanceTypes';

interface StepProps {
  data: ClearanceQuote;
  onChange: (updates: Partial<ClearanceQuote>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function ClearanceStep3Access({ data, onChange, onNext, onBack }: StepProps) {
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
      <div className="bg-white p-12 rounded-2xl shadow-lg border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Step 3: Access Details</h2>
        <p className="text-slate-600 mb-6">Floor, lift, parking distance...</p>
        <div className="flex justify-between pt-6">
          <button onClick={onBack} className="px-6 py-3 rounded-lg font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 flex items-center gap-2">
            <ArrowLeft className="w-5 h-5" /> Back
          </button>
          <button onClick={onNext} className="px-6 py-3 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
            Next <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
