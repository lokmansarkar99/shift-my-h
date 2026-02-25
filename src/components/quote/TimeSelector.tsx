/**
 * Time Selector Component
 * Allows users to select preferred arrival time
 */

import React from 'react';
import { Clock } from 'lucide-react';

interface TimeSelectorProps {
  selectedTime?: string;
  onTimeSelect?: (time: string) => void;
  // Alternative props for Step 1 (time range)
  startTime?: number;
  endTime?: number;
  onChange?: (start: number, end: number) => void;
}

const TIME_SLOTS = [
  { value: '08:00-10:00', label: '8am - 10am', icon: '🌅', start: 480, end: 600 },
  { value: '10:00-12:00', label: '10am - 12pm', icon: '☀️', start: 600, end: 720 },
  { value: '12:00-14:00', label: '12pm - 2pm', icon: '🌞', start: 720, end: 840 },
  { value: '14:00-16:00', label: '2pm - 4pm', icon: '⛅', start: 840, end: 960 },
  { value: '16:00-18:00', label: '4pm - 6pm', icon: '🌆', start: 960, end: 1080 },
];

export function TimeSelector({ selectedTime, onTimeSelect, startTime, endTime, onChange }: TimeSelectorProps) {
  // Determine if we're in Step 1 mode (time range) or Step 4 mode (simple selection)
  const isStep1Mode = startTime !== undefined && endTime !== undefined && onChange !== undefined;

  const handleSlotClick = (slot: typeof TIME_SLOTS[0]) => {
    if (isStep1Mode) {
      // Step 1: Update time range
      onChange!(slot.start, slot.end);
    } else {
      // Step 4: Simple selection
      onTimeSelect!(slot.value);
    }
  };

  const isSlotSelected = (slot: typeof TIME_SLOTS[0]) => {
    if (isStep1Mode) {
      // Step 1: Check if time range matches
      return startTime === slot.start && endTime === slot.end;
    } else {
      // Step 4: Check if value matches
      return selectedTime === slot.value;
    }
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
          <Clock className="w-3.5 h-3.5 text-white" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900">Select Time</h3>
          <p className="text-[10px] text-slate-600">2-hour window</p>
        </div>
      </div>

      {/* Time Slots */}
      <div className="space-y-1.5">
        {TIME_SLOTS.map((slot) => {
          const isSelected = isSlotSelected(slot);
          return (
            <button
              key={slot.value}
              onClick={() => handleSlotClick(slot)}
              type="button"
              className={`w-full p-2 rounded-lg border transition-all text-left ${
                isSelected
                  ? 'border-purple-500 bg-purple-50 shadow-md ring-2 ring-purple-200'
                  : 'border-slate-200 hover:border-purple-300 hover:bg-purple-50 bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-base">{slot.icon}</span>
                  <div className={`text-xs font-bold ${isSelected ? 'text-purple-700' : 'text-slate-900'}`}>
                    {slot.label}
                  </div>
                </div>
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    isSelected ? 'border-purple-600 bg-purple-600' : 'border-slate-300'
                  }`}
                >
                  {isSelected && (
                    <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
        <div className="flex items-start gap-1.5">
          <span className="text-sm">💡</span>
          <div>
            <p className="text-[10px] font-semibold text-blue-900 mb-0.5">Flexible Timing</p>
            <p className="text-[9px] text-blue-700 leading-snug">
              We'll confirm exact time 24h before.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}