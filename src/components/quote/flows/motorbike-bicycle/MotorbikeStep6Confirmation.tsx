import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle } from 'lucide-react';
import { MotorbikeQuote } from './motorbikeTypes';

interface StepProps {
  data: MotorbikeQuote;
  onChange: (updates: Partial<MotorbikeQuote>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function MotorbikeStep6Confirmation({ data }: StepProps) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
      <div className="bg-white p-12 rounded-2xl shadow-lg border border-slate-200 text-center">
        <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Quote Confirmed!</h2>
        <p className="text-lg text-slate-600 mb-2">Your quote reference: <strong>{data.quoteReference}</strong></p>
        <p className="text-slate-500">We'll be in touch shortly to confirm your booking.</p>
        <button onClick={() => window.location.href = '/'} className="mt-8 px-8 py-3 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700">
          Back to Homepage
        </button>
      </div>
    </motion.div>
  );
}
