import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle } from 'lucide-react';
import { HouseMoveQuote } from './houseMoveTypes';

interface StepProps {
  data: HouseMoveQuote;
}

export function HouseMoveStep6Confirmation({ data }: StepProps) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
      <div className="bg-white p-12 rounded-2xl shadow-lg border border-green-200 text-center">
        <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Quote Confirmed!</h2>
        <p className="text-lg text-slate-600 mb-6">
          Your house move quote has been submitted successfully.
        </p>
        <button 
          onClick={() => window.location.href = '/'}
          className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
        >
          Back to Homepage
        </button>
      </div>
    </motion.div>
  );
}
