import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface QuoteReferenceDisplayProps {
  quoteRef: string;
  showSupportMessage?: boolean;
}

export function QuoteReferenceDisplay({ quoteRef, showSupportMessage = true }: QuoteReferenceDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    // Fallback method for copying text (works in all browsers)
    const textArea = document.createElement('textarea');
    textArea.value = quoteRef;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      textArea.remove();
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      textArea.remove();
    }
  };

  return (
    <div className="pb-3 border-b border-slate-200">
      <div className="text-xs font-semibold text-slate-500 uppercase mb-1">
        Your ShiftMyHome Reference
      </div>
      <div className="flex items-center justify-between gap-2 mb-1">
        <div className="text-base font-bold text-slate-900 font-mono tracking-wide">
          {quoteRef}
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors flex-shrink-0"
          title="Copy reference"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-green-600" />
          ) : (
            <Copy className="w-3.5 h-3.5 text-slate-600" />
          )}
        </button>
      </div>
      {showSupportMessage && (
        <div className="text-xs text-slate-500 leading-relaxed">
          Please quote this reference if you contact support
        </div>
      )}
    </div>
  );
}