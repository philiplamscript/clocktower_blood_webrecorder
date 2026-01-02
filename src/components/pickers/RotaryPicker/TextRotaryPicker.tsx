import React, { useRef, useEffect } from 'react';

interface TextRotaryPickerProps {
  value: string;
  options: string[];
  onChange: (val: string) => void;
  color?: string;
}

const TextRotaryPicker: React.FC<TextRotaryPickerProps> = ({ value, options, onChange, color = "text-slate-900" }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const itemHeight = 24;

  useEffect(() => {
    if (scrollRef.current) {
      const index = options.indexOf(value);
      if (index !== -1) {
        scrollRef.current.scrollTop = index * itemHeight;
      }
    }
  }, [value, options]);

  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollTop = scrollRef.current.scrollTop;
      const index = Math.round(scrollTop / itemHeight);
      const newVal = options[index];
      if (newVal !== undefined && newVal !== value) {
        onChange(newVal);
      }
    }
  };

  const getStatusColor = (val: string) => {
    if (val === "POSS") return "text-blue-500";
    if (val === "CONF") return "text-emerald-500";
    if (val === "NOT") return "text-red-500";
    return "text-slate-400";
  };

  return (
    <div 
      ref={scrollRef}
      onScroll={handleScroll}
      className="h-[24px] w-full overflow-y-auto no-scrollbar snap-y snap-mandatory cursor-ns-resize"
      style={{ scrollbarWidth: 'none' }}
    >
      {options.map((opt) => (
        <div 
          key={opt} 
          className={`h-[24px] flex items-center justify-center snap-center text-[8px] font-black transition-opacity ${opt === value ? `${getStatusColor(opt)} opacity-100` : 'text-slate-300 opacity-20'}`}
        >
          {opt}
        </div>
      ))}
      <div className="h-0" />
    </div>
  );
};

export default TextRotaryPicker;