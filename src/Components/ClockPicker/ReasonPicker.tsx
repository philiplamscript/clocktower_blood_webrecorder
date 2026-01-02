import { useState, useRef, useEffect } from 'react';
import { Skull } from 'lucide-react';
import { REASON_CYCLE } from '../../type';
import { getSlicePath } from '../../utils/svgUtils';

const ReasonPicker = ({ value, onChange }: { value: string, onChange: (val: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      const handleClickOutside = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) setIsOpen(false);
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div className="relative w-full h-full flex items-center justify-center" ref={containerRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className={`w-full h-full text-lg flex items-center justify-center transition-colors ${isOpen ? 'bg-slate-100' : 'hover:bg-slate-50'}`}
      >
        {value}
      </button>

      {isOpen && (
        <div className="absolute z-[10001] top-1/2 left-full ml-4 -translate-y-1/2 animate-in fade-in zoom-in-95 slide-in-from-left-2 duration-150 origin-left">
          <div className="bg-white/95 backdrop-blur-md p-1.5 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-slate-200 w-44 h-44 relative">
            <svg viewBox="0 0 160 160" className="w-full h-full">
              {REASON_CYCLE.map((reason, i) => {
                const isSelected = value === reason;
                const path = getSlicePath(i, REASON_CYCLE.length, 30, 78, 80, 80);
                const angle = (i * (360 / REASON_CYCLE.length)) - 90 + (360 / (REASON_CYCLE.length * 2));
                const textRad = 54;
                const tx = 80 + textRad * Math.cos(angle * Math.PI / 180);
                const ty = 80 + textRad * Math.sin(angle * Math.PI / 180);

                return (
                  <g key={reason} onClick={() => { onChange(reason); setIsOpen(false); }} className="cursor-pointer group">
                    <path d={path} fill={isSelected ? '#0f172a' : '#ffffff'} stroke="#f1f5f9" className="transition-colors group-hover:fill-slate-50" />
                    <text x={tx} y={ty} textAnchor="middle" alignmentBaseline="middle" className={`text-base select-none ${isSelected ? 'brightness-150' : ''}`}>{reason}</text>
                  </g>
                );
              })}
            </svg>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-12 h-12 rounded-full bg-slate-900 border-4 border-white shadow-lg flex items-center justify-center">
                <Skull size={14} className="text-red-500" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReasonPicker;