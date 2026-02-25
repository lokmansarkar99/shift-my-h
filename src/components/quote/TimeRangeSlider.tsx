import React, { useState, useEffect, useRef } from 'react';
import { Clock } from 'lucide-react';

interface TimeRangeSliderProps {
  startTime: number; // Minutes from midnight (e.g., 480 = 08:00)
  endTime: number;   // Minutes from midnight (e.g., 600 = 10:00)
  onChange: (start: number, end: number) => void;
  minGap?: number; // Minimum gap in minutes (default: 60)
}

// Convert minutes to HH:MM format
function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

export function TimeRangeSlider({ 
  startTime, 
  endTime, 
  onChange,
  minGap = 60 // Default 1 hour
}: TimeRangeSliderProps) {
  const MIN_TIME = 360;  // 06:00
  const MAX_TIME = 1200; // 20:00
  const STEP = 30;       // 30 minutes

  const [localStart, setLocalStart] = useState(startTime);
  const [localEnd, setLocalEnd] = useState(endTime);
  const [isDragging, setIsDragging] = useState<'start' | 'end' | null>(null);
  
  const sliderRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>();

  // Update local state when props change
  useEffect(() => {
    setLocalStart(startTime);
    setLocalEnd(endTime);
  }, [startTime, endTime]);

  // Calculate value from mouse/touch position
  const calculateValueFromPosition = (clientX: number): number => {
    if (!sliderRef.current) return MIN_TIME;
    
    const rect = sliderRef.current.getBoundingClientRect();
    const percentage = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const value = MIN_TIME + (MAX_TIME - MIN_TIME) * percentage;
    const rounded = Math.round(value / STEP) * STEP;
    
    return Math.max(MIN_TIME, Math.min(MAX_TIME, rounded));
  };

  // Handle mouse/touch move
  const handleMove = (clientX: number) => {
    if (!isDragging) return;

    // Cancel any pending animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    // Use requestAnimationFrame for smooth updates
    animationFrameRef.current = requestAnimationFrame(() => {
      const value = calculateValueFromPosition(clientX);

      if (isDragging === 'start') {
        const newStart = Math.min(value, localEnd - minGap);
        if (newStart !== localStart) {
          setLocalStart(newStart);
          onChange(newStart, localEnd);
        }
      } else if (isDragging === 'end') {
        const newEnd = Math.max(value, localStart + minGap);
        if (newEnd !== localEnd) {
          setLocalEnd(newEnd);
          onChange(localStart, newEnd);
        }
      }
    });
  };

  // Mouse events
  const handleMouseDown = (handle: 'start' | 'end') => (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(handle);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      e.preventDefault();
      handleMove(e.clientX);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(null);
  };

  // Touch events
  const handleTouchStart = (handle: 'start' | 'end') => (e: React.TouchEvent) => {
    e.stopPropagation();
    setIsDragging(handle);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (isDragging && e.touches[0]) {
      e.preventDefault();
      handleMove(e.touches[0].clientX);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(null);
  };

  // Add/remove global event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
        
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }
  }, [isDragging, localStart, localEnd]);

  // Calculate percentage for visual position
  const getPercentage = (value: number) => {
    return ((value - MIN_TIME) / (MAX_TIME - MIN_TIME)) * 100;
  };

  const startPercentage = getPercentage(localStart);
  const endPercentage = getPercentage(localEnd);

  // Generate time markers every 2 hours
  const timeMarkers = [];
  for (let time = MIN_TIME; time <= MAX_TIME; time += 120) { // Every 2 hours
    timeMarkers.push(time);
  }

  return (
    <div className="w-full select-none">
      {/* Slider Container */}
      <div className="relative pt-2 pb-12">
        <div 
          ref={sliderRef}
          className="relative h-3 bg-slate-200 rounded-full cursor-pointer"
        >
          {/* Time Markers */}
          {timeMarkers.map((time) => (
            <div
              key={time}
              className="absolute top-0 bottom-0 w-0.5 bg-slate-300"
              style={{ left: `${getPercentage(time)}%` }}
            />
          ))}

          {/* Active Range */}
          <div
            className="absolute h-3 bg-gradient-to-r from-red-500 to-red-600 rounded-full transition-all duration-100"
            style={{
              left: `${startPercentage}%`,
              width: `${endPercentage - startPercentage}%`,
            }}
          />

          {/* Start Handle */}
          <div
            className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-7 h-7 bg-white border-4 border-red-600 rounded-full cursor-grab shadow-lg transition-transform ${
              isDragging === 'start' ? 'scale-125 cursor-grabbing' : 'hover:scale-110'
            }`}
            style={{ left: `${startPercentage}%` }}
            onMouseDown={handleMouseDown('start')}
            onTouchStart={handleTouchStart('start')}
          >
            {/* Visual indicator */}
            <div className="absolute inset-0 rounded-full bg-red-600 opacity-0 hover:opacity-10 transition-opacity" />
          </div>

          {/* End Handle */}
          <div
            className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-7 h-7 bg-white border-4 border-red-600 rounded-full cursor-grab shadow-lg transition-transform ${
              isDragging === 'end' ? 'scale-125 cursor-grabbing' : 'hover:scale-110'
            }`}
            style={{ left: `${endPercentage}%` }}
            onMouseDown={handleMouseDown('end')}
            onTouchStart={handleTouchStart('end')}
          >
            {/* Visual indicator */}
            <div className="absolute inset-0 rounded-full bg-red-600 opacity-0 hover:opacity-10 transition-opacity" />
          </div>

          {/* Time Labels - Start */}
          <div
            className="absolute -bottom-8 -translate-x-1/2 text-sm font-bold text-red-600 whitespace-nowrap bg-white px-2 py-1 rounded-lg shadow-sm"
            style={{ left: `${startPercentage}%` }}
          >
            {minutesToTime(localStart)}
          </div>

          {/* Time Labels - End */}
          <div
            className="absolute -bottom-8 -translate-x-1/2 text-sm font-bold text-red-600 whitespace-nowrap bg-white px-2 py-1 rounded-lg shadow-sm"
            style={{ left: `${endPercentage}%` }}
          >
            {minutesToTime(localEnd)}
          </div>
        </div>

        {/* Min/Max Labels */}
        <div className="absolute -bottom-2 left-0 text-xs text-slate-500 font-medium">
          {minutesToTime(MIN_TIME)}
        </div>
        <div className="absolute -bottom-2 right-0 text-xs text-slate-500 font-medium">
          {minutesToTime(MAX_TIME)}
        </div>
      </div>

      {/* Arrival Window Display */}
      <div className="mt-8 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-4 border border-red-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
            <Clock className="w-5 h-5 text-red-600" />
          </div>
          <div className="flex-1">
            <div className="text-xs font-semibold text-slate-600 uppercase mb-1">
              Estimated Arrival Window
            </div>
            <div className="text-xl font-bold text-slate-900">
              {minutesToTime(localStart)} – {minutesToTime(localEnd)}
            </div>
            <div className="text-xs text-slate-600 mt-1">
              {((localEnd - localStart) / 60).toFixed(1)} hour window
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}