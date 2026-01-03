import React, { useRef, useEffect } from 'react';

interface RotaryPickerProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (val: number) => void;
  color?: string;
  options?: (string | number)[]; // New prop for custom labels
}

const RotaryPicker: React.FC<RotaryPickerProps> = ({ 
  value, 
  min = 0, 
  max = 20, 
  onChange, 
  color = "text-white",
  options
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const itemHeight = 24;

  const items = options || Array.from({ length: max - min + 1 }, (_, i) => min + i);
  const currentIndex = options ? value : value - min;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = currentIndex * itemHeight;
    }
  }, [currentIndex]);

  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollTop = scrollRef.current.scrollTop;
      const index = Math.round(scrollTop / itemHeight);
      
      // Calculate new value based on index
      const newVal = options ? index : index + min;
      
      if (newVal !== undefined && index >= 0 && index < items.length && newVal !== value) {
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
      {items.map((item, idx) => (
        <div 
          key={idx} 
          className={`h-[24px] flex items-center justify-center snap-center text-[10px] font-black transition-all ${idx === currentIndex ? `${color} opacity-100 scale-110` : 'text-slate-400 opacity-30'}`}
        >
          {item}
        </div>
      ))}
      {/* Buffer to allow scrolling to the end */}
      <div className="h-0" />
    </div>
  );
};

export default RotaryPicker;