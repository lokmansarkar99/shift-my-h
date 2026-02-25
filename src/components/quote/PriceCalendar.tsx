import React, { useState, useMemo, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Check, X } from 'lucide-react';
import { getPricingConfig, DayOfWeekMultipliers } from '../../utils/pricingConfigService';

interface PriceCalendarProps {
  basePrice: number;
  selectedDate: string;
  onDateSelect: (date: string, price: number) => void;
  minDate?: Date;
  contextInfo: {
    route?: string;
    distance?: number;
    itemCount?: number;
    volume?: number;
    package?: string;
  };
  isOpen: boolean; // ✅ NEW: Control modal visibility
  onClose: () => void; // ✅ NEW: Close handler
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function PriceCalendar({ basePrice, selectedDate, onDateSelect, minDate, contextInfo, isOpen, onClose }: PriceCalendarProps) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  
  // 📊 Load day multipliers from pricing config
  const [dayMultipliers, setDayMultipliers] = useState<DayOfWeekMultipliers>({
    sunday: 1.15,
    monday: 1.0,
    tuesday: 0.95,
    wednesday: 0.95,
    thursday: 1.0,
    friday: 1.10,
    saturday: 1.15,
  });

  // Load config on mount
  useEffect(() => {
    const loadConfig = async () => {
      const config = await getPricingConfig();
      if (config.dayOfWeekMultipliers) {
        setDayMultipliers(config.dayOfWeekMultipliers);
      }
    };
    loadConfig();
  }, []);

  // Calculate price for a specific day using config multipliers
  const getPriceForDay = (dayOfWeek: number): number => {
    const dayNames: (keyof DayOfWeekMultipliers)[] = [
      'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'
    ];
    const multiplier = dayMultipliers[dayNames[dayOfWeek]] || 1.0;
    return Math.round(basePrice * multiplier);
  };

  // Get all days in current month
  const getDaysInMonth = () => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: Array<{
      date: Date;
      dayNumber: number;
      price: number;
      isDisabled: boolean;
      isToday: boolean;
      isSelected: boolean;
    }> = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push({
        date: new Date(0),
        dayNumber: 0,
        price: 0,
        isDisabled: true,
        isToday: false,
        isSelected: false,
      });
    }

    // Add actual days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const dayOfWeek = date.getDay();
      const price = getPriceForDay(dayOfWeek);
      
      const dateStr = date.toISOString().split('T')[0];
      const isPast = minDate ? date < minDate : date < today;
      const isTodayDate = date.toDateString() === today.toDateString();
      const isSelectedDate = dateStr === selectedDate;

      days.push({
        date,
        dayNumber: day,
        price,
        isDisabled: isPast,
        isToday: isTodayDate,
        isSelected: isSelectedDate,
      });
    }

    return days;
  };

  // Find cheapest day in current view
  const cheapestPrice = useMemo(() => {
    const days = getDaysInMonth();
    const availableDays = days.filter(d => !d.isDisabled && d.dayNumber > 0);
    if (availableDays.length === 0) return null;
    return Math.min(...availableDays.map(d => d.price));
  }, [currentMonth, currentYear, basePrice]);

  // Get price tier (Low/Medium/High)
  const getPriceTier = (price: number): 'low' | 'medium' | 'high' | null => {
    if (!cheapestPrice) return null;
    const diff = price - cheapestPrice;
    
    if (diff === 0) return 'low';
    if (diff < basePrice * 0.1) return 'medium';
    return 'high';
  };

  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const days = getDaysInMonth();

  // Selected date info
  const selectedDateObj = selectedDate ? new Date(selectedDate) : null;
  const selectedPrice = selectedDateObj ? getPriceForDay(selectedDateObj.getDay()) : null;

  // Temporary selection before confirmation
  const [tempSelectedDate, setTempSelectedDate] = useState<string>(selectedDate);
  const tempSelectedDateObj = tempSelectedDate ? new Date(tempSelectedDate) : null;
  const tempSelectedPrice = tempSelectedDateObj ? getPriceForDay(tempSelectedDateObj.getDay()) : null;

  // Reset temp selection when modal opens
  useEffect(() => {
    if (isOpen) {
      setTempSelectedDate(selectedDate);
    }
  }, [isOpen, selectedDate]);

  // Lock scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  const handleConfirm = () => {
    if (tempSelectedDate && tempSelectedPrice) {
      onDateSelect(tempSelectedDate, tempSelectedPrice);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container - Desktop: centered modal, Mobile: bottom drawer */}
      <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 pointer-events-none">
        <div 
          className="bg-white rounded-t-3xl md:rounded-2xl shadow-2xl w-full md:max-w-4xl max-h-[90vh] overflow-y-auto pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header with Close Button */}
          <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between rounded-t-3xl md:rounded-t-2xl z-10">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Select a move date</h2>
              <p className="text-sm text-slate-600 mt-1">
                Prices shown are for your current quote (route + inventory + package).
              </p>
            </div>
            {/* ✅ Close button - Prevent form submission */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors flex-shrink-0"
              aria-label="Close"
            >
              <X className="w-6 h-6 text-slate-600" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">{/* Context Chip */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
              <span className="text-sm font-semibold text-blue-900">
                {contextInfo.route && contextInfo.distance ? (
                  <>
                    {contextInfo.route} • {contextInfo.distance.toFixed(1)} miles
                    {contextInfo.itemCount && `  ${contextInfo.itemCount} items`}
                    {contextInfo.volume && ` • ${contextInfo.volume.toFixed(2)} m³`}
                    {contextInfo.package && ` • ${contextInfo.package}`}
                  </>
                ) : (
                  'Furniture & Items Move'
                )}
              </span>
            </div>

            {/* Calendar */}
            <div className="bg-slate-50 rounded-2xl p-4 md:p-6">
              {/* Month Navigation */}
              <div className="flex items-center justify-between mb-6">
                {/* Previous Month Button */}
                <button
                  type="button"
                  onClick={goToPreviousMonth}
                  className="p-2 hover:bg-white rounded-lg transition-colors"
                  aria-label="Previous month"
                >
                  <ChevronLeft className="w-5 h-5 text-slate-600" />
                </button>
                
                <h3 className="text-lg font-bold text-slate-900">
                  {MONTHS[currentMonth]} {currentYear}
                </h3>
                
                {/* Next Month Button */}
                <button
                  type="button"
                  onClick={goToNextMonth}
                  className="p-2 hover:bg-white rounded-lg transition-colors"
                  aria-label="Next month"
                >
                  <ChevronRight className="w-5 h-5 text-slate-600" />
                </button>
              </div>

              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-1 md:gap-2 mb-2">
                {DAYS.map(day => (
                  <div key={day} className="text-center text-xs font-semibold text-slate-500 py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 md:gap-2">
                {days.map((day, idx) => {
                  if (day.dayNumber === 0) {
                    return <div key={idx} />;
                  }

                  const tier = getPriceTier(day.price);
                  const isCheapest = day.price === cheapestPrice;
                  const dateStr = day.date.toISOString().split('T')[0];
                  const isTempSelected = dateStr === tempSelectedDate;

                  return (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => {
                        if (!day.isDisabled) {
                          setTempSelectedDate(dateStr);
                        }
                      }}
                      disabled={day.isDisabled}
                      className={`
                        relative p-2 md:p-3 rounded-lg md:rounded-xl border-2 transition-all
                        ${day.isDisabled 
                          ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed' 
                          : isTempSelected
                            ? 'bg-green-600 border-green-700 text-white shadow-lg scale-105'
                            : tier === 'low'
                              ? 'bg-green-50 border-green-300 hover:border-green-500 hover:shadow-md'
                              : tier === 'medium'
                                ? 'bg-yellow-50 border-yellow-300 hover:border-yellow-500 hover:shadow-md'
                                : 'bg-red-50 border-red-300 hover:border-red-500 hover:shadow-md'
                        }
                      `}
                    >
                      {/* Day Number */}
                      <div className={`text-xs md:text-sm font-bold mb-0.5 md:mb-1 ${isTempSelected ? 'text-white' : 'text-slate-900'}`}>
                        {day.dayNumber}
                        {day.isToday && !isTempSelected && (
                          <span className="ml-1 text-[10px] text-blue-600">•</span>
                        )}
                      </div>

                      {/* Price */}
                      {!day.isDisabled && (
                        <div className={`text-[10px] md:text-xs font-semibold ${isTempSelected ? 'text-white' : 'text-slate-700'}`}>
                          £{day.price}
                        </div>
                      )}

                      {/* Badges */}
                      {!day.isDisabled && isCheapest && !isTempSelected && (
                        <div className="absolute -top-1 -right-1 bg-green-600 text-white text-[8px] md:text-[9px] font-bold px-1 md:px-1.5 py-0.5 rounded-full">
                          BEST
                        </div>
                      )}

                      {/* Selected Check */}
                      {isTempSelected && (
                        <div className="absolute -top-1 -right-1 bg-white text-green-600 rounded-full p-0.5">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-slate-300 flex items-center justify-center gap-3 md:gap-6 text-xs">
                <div className="flex items-center gap-1.5 md:gap-2">
                  <div className="w-3 h-3 md:w-4 md:h-4 bg-green-50 border-2 border-green-300 rounded" />
                  <span className="text-slate-600">Low</span>
                </div>
                <div className="flex items-center gap-1.5 md:gap-2">
                  <div className="w-3 h-3 md:w-4 md:h-4 bg-yellow-50 border-2 border-yellow-300 rounded" />
                  <span className="text-slate-600">Medium</span>
                </div>
                <div className="flex items-center gap-1.5 md:gap-2">
                  <div className="w-3 h-3 md:w-4 md:h-4 bg-red-50 border-2 border-red-300 rounded" />
                  <span className="text-slate-600">High</span>
                </div>
              </div>
            </div>

            {/* Confirmation Area */}
            {tempSelectedDateObj && tempSelectedPrice && (
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-6 text-white">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold opacity-90">Selected Move Date</p>
                    <p className="text-xl md:text-2xl font-bold mt-1">
                      {tempSelectedDateObj.toLocaleDateString('en-GB', { 
                        weekday: 'short', 
                        day: 'numeric', 
                        month: 'short', 
                        year: 'numeric' 
                      })}
                    </p>
                    <p className="text-xs md:text-sm mt-1 opacity-75">
                      This price is based on your current items & route.
                    </p>
                  </div>
                  <div className="text-left md:text-right">
                    <p className="text-sm font-semibold opacity-90">Estimated Price</p>
                    <p className="text-2xl md:text-3xl font-bold">£{tempSelectedPrice}</p>
                  </div>
                </div>
                {/* Confirm Date Button - Prevent form submission */}
                <button
                  type="button"
                  onClick={handleConfirm}
                  className="w-full mt-4 py-3 bg-white text-green-600 font-bold rounded-xl hover:bg-green-50 transition-all"
                >
                  Confirm Date
                </button>
              </div>
            )}

            {!tempSelectedDateObj && (
              <div className="text-center py-4 text-slate-500 text-sm">
                Select a date from the calendar above
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}