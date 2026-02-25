/**
 * Pricing Calendar Component
 * Shows dynamic pricing based on day of week multipliers
 * MODERN DESIGN - Clear & Intuitive
 */

import React, { useState, useMemo } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, TrendingDown, TrendingUp, Minus } from 'lucide-react';

interface PricingCalendarProps {
  basePrice: number;
  selectedDate: string;
  onDateSelect: (date: string) => void;
  minDate: string;
}

// Day multipliers (based on demand)
const DAY_MULTIPLIERS = {
  0: 1.15,  // Sunday +15%
  1: 1.0,   // Monday ±0%
  2: 0.95,  // Tuesday -5%
  3: 0.95,  // Wednesday -5%
  4: 1.0,   // Thursday ±0%
  5: 1.1,   // Friday +10%
  6: 1.15,  // Saturday +15%
};

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function PricingCalendar({ basePrice, selectedDate, onDateSelect, minDate }: PricingCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Generate calendar days for current month view
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    // First day of month
    const firstDay = new Date(year, month, 1);
    const firstDayWeek = firstDay.getDay();
    
    // Last day of month
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    const days = [];
    
    // Add empty slots for days before month starts
    for (let i = 0; i < firstDayWeek; i++) {
      days.push(null);
    }
    
    // Add all days in month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  }, [currentMonth]);

  const getMultiplier = (dayOfWeek: number) => {
    return DAY_MULTIPLIERS[dayOfWeek as keyof typeof DAY_MULTIPLIERS] || 1.0;
  };

  const getPrice = (dayOfWeek: number) => {
    return basePrice * getMultiplier(dayOfWeek);
  };

  const getPriceInfo = (dayOfWeek: number) => {
    const multiplier = getMultiplier(dayOfWeek);
    const price = getPrice(dayOfWeek);
    const percentage = ((multiplier - 1) * 100).toFixed(0);
    const percentageNum = parseInt(percentage);
    
    if (percentageNum < 0) {
      return {
        text: `${percentage}%`,
        badge: 'BEST PRICE',
        color: 'emerald',
        bgColor: 'bg-emerald-500',
        borderColor: 'border-emerald-500',
        hoverBg: 'hover:bg-emerald-50',
        selectedBg: 'bg-emerald-50',
        textColor: 'text-emerald-600',
        icon: <TrendingDown className="w-4 h-4" />,
        price,
      };
    } else if (percentageNum > 0) {
      return {
        text: `+${percentage}%`,
        badge: 'PEAK',
        color: 'orange',
        bgColor: 'bg-orange-500',
        borderColor: 'border-orange-500',
        hoverBg: 'hover:bg-orange-50',
        selectedBg: 'bg-orange-50',
        textColor: 'text-orange-600',
        icon: <TrendingUp className="w-4 h-4" />,
        price,
      };
    } else {
      return {
        text: '±0%',
        badge: 'STANDARD',
        color: 'blue',
        bgColor: 'bg-blue-500',
        borderColor: 'border-blue-500',
        hoverBg: 'hover:bg-blue-50',
        selectedBg: 'bg-blue-50',
        textColor: 'text-blue-600',
        icon: <Minus className="w-4 h-4" />,
        price,
      };
    }
  };

  const formatDateString = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const isDateDisabled = (date: Date) => {
    const minDateObj = new Date(minDate);
    return date < minDateObj;
  };

  const isDateSelected = (date: Date) => {
    return formatDateString(date) === selectedDate;
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const isPreviousMonthDisabled = () => {
    const minDateObj = new Date(minDate);
    const prevMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    return prevMonth < new Date(minDateObj.getFullYear(), minDateObj.getMonth(), 1);
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
          <CalendarIcon className="w-3.5 h-3.5 text-white" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900">Select Date</h3>
          <p className="text-[10px] text-slate-600">Save on off-peak days</p>
        </div>
      </div>

      {/* Month Navigation */}
      <div className="flex items-center justify-between bg-slate-100 rounded-lg p-1.5">
        <button
          onClick={goToPreviousMonth}
          disabled={isPreviousMonthDisabled()}
          className="p-1 text-slate-700 hover:bg-white rounded transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>
        <div className="text-xs font-bold text-slate-900">
          {MONTH_NAMES[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </div>
        <button
          onClick={goToNextMonth}
          className="p-1 text-slate-700 hover:bg-white rounded transition-all"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Calendar Grid */}
      <div>
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-1.5 mb-1.5">
          {DAY_NAMES.map((day) => (
            <div key={day} className="text-center py-1.5">
              <span className="text-xs font-bold text-slate-600">{day.charAt(0)}</span>
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1.5">
          {calendarDays.map((date, index) => {
            if (!date) {
              return <div key={`empty-${index}`} className="aspect-square" />;
            }

            const dayOfWeek = date.getDay();
            const priceInfo = getPriceInfo(dayOfWeek);
            const disabled = isDateDisabled(date);
            const selected = isDateSelected(date);
            const dateString = formatDateString(date);
            const isToday = formatDateString(new Date()) === dateString;

            return (
              <button
                key={index}
                onClick={() => !disabled && onDateSelect(dateString)}
                disabled={disabled}
                className={`relative aspect-square p-2 rounded-lg border transition-all ${
                  disabled
                    ? 'opacity-30 cursor-not-allowed bg-slate-50 border-slate-200'
                    : selected
                    ? `border-${priceInfo.color}-500 ${priceInfo.selectedBg} shadow-lg ring-2 ring-${priceInfo.color}-300`
                    : `border-slate-200 ${priceInfo.hoverBg} hover:shadow-md bg-white`
                }`}
              >
                {/* Badge */}
                {!disabled && (
                  <div className={`absolute -top-2 left-1/2 -translate-x-1/2 ${priceInfo.bgColor} text-white px-1.5 py-0.5 rounded text-[7px] font-bold shadow-sm`}>
                    {priceInfo.badge === 'BEST PRICE' ? '💰' : priceInfo.badge === 'PEAK' ? '🔥' : '✓'}
                  </div>
                )}

                {/* Today Indicator */}
                {isToday && !disabled && (
                  <div className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                )}

                {/* Date Number */}
                <div className={`text-sm font-bold mb-0.5 ${
                  selected ? priceInfo.textColor : disabled ? 'text-slate-400' : 'text-slate-900'
                }`}>
                  {date.getDate()}
                </div>

                {/* Price */}
                {!disabled && (
                  <div className={`text-[10px] font-bold leading-tight ${selected ? priceInfo.textColor : 'text-slate-700'}`}>
                    £{priceInfo.price.toFixed(0)}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="bg-slate-50 rounded-lg p-2 border border-slate-200">
        <div className="flex items-center justify-between text-[9px]">
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
            <span className="text-slate-700">Best -5%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
            <span className="text-slate-700">Std ±0%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
            <span className="text-slate-700">Peak +15%</span>
          </div>
        </div>
      </div>
    </div>
  );
}