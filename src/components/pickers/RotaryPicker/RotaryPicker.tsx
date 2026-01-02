import React, { useRef, useEffect } from 'react';

interface RotaryPickerProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (val: number) => void;
  color?: string;
}

const RotaryPicker: React.FC<RotaryPickerProps> = ({ value, min = 0, max = 20, onChange, color = "text-white" }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const itemHeight = 24; // height of each number in px

  const numbers = Array.from({ length: max - min + 1 }, (_, i) => min + i);

  useEffect(() => {
    if (scrollRef.current) {
      const index = value - min;
      scrollRef.current.scrollTop = index * itemHeight;
    }
  }, [value, min]);

  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollTop = scrollRef.current.scrollTop;
      const index = Math.round(scrollTop / itemHeight);
      const newVal = numbers[index];
      if (newVal !== undefined && newVal !== value) {
        onChange(newVal);
      }
    }
  };

  return (
    <div 
      ref={scrollRef}
      onScroll={handleScroll}
      className="h-[24px] w-full overflow-y-auto no-scrollbar snap-y snap-mandatory cursor-ns-resize"
      style={{ scrollbarWidth: 'none' }}
    >
      {numbers.map((num) => (
        <div 
          key={num} 
          className={`h-[24px] flex items-center justify-center snap-center text-[11px] font-black transition-opacity ${num === value ? `${color} opacity-100` : 'text-slate-600 opacity-30'}`}
        >
          {num}
        </div>
      ))}
      {/* Spacer to allow scrolling to the last element */}
      <div className="h-0" />
    </div>
  );
};

export default RotaryPicker;