import React from 'react';
import { Phone } from 'lucide-react';

interface CallMeButtonProps {
  onClick: () => void;
}

export function CallMeButton({ onClick }: CallMeButtonProps) {
  return (
    <button
      onClick={onClick}
      className="hidden lg:flex fixed bottom-6 left-6 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 hover:from-purple-700 hover:via-pink-700 hover:to-red-700 text-white px-6 py-4 rounded-full shadow-2xl hover:shadow-pink-500/50 hover:scale-110 transition-all duration-300 z-[99] group items-center gap-3 font-bold animate-pulse hover:animate-none"
      title="Request Callback"
    >
      <Phone className="w-6 h-6 animate-bounce group-hover:animate-none" />
      <span className="text-base font-bold tracking-wide">CALL ME BACK</span>
    </button>
  );
}