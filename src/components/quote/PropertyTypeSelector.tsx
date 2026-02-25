import React from 'react';
import { INVENTORY_PRESETS } from './InventoryPresets';

interface PropertyTypeSelectorProps {
  selectedPresetId: string | null;
  onSelectPreset: (presetId: string) => void;
}

export function PropertyTypeSelector({ selectedPresetId, onSelectPreset }: PropertyTypeSelectorProps) {
  return (
    <div className="mb-6">
      <div className="text-sm font-semibold text-slate-600 mb-3">
        Or select a property type to auto-load items:
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {INVENTORY_PRESETS.map(preset => (
          <button
            key={preset.id}
            type="button"
            onClick={() => onSelectPreset(preset.id)}
            className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-2 hover:shadow-md ${
              selectedPresetId === preset.id
                ? 'border-blue-600 bg-blue-50 shadow-md'
                : 'border-slate-200 bg-white hover:border-blue-300'
            }`}
          >
            <span className="text-2xl">{preset.icon}</span>
            <span className={`text-xs font-semibold text-center leading-tight ${
              selectedPresetId === preset.id ? 'text-blue-900' : 'text-slate-700'
            }`}>
              {preset.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
