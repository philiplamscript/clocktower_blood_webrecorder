import { useState, useRef, useEffect, useCallback } from 'react';
import { getSlicePath } from '../../utils/svgUtils';

const ClockPicker = ({ 
  value, 
  onChange, 
  label, 
  isMulti = false,
  forValue = "",
  targetValue = "",
  deadPlayers = [],
  onSetBoth,
  playerCount = 15
}: { 
  value: string, 
  onChange: (val: string) => void, 
  label?: string,
  isMulti?: boolean,
  forValue?: string,
  targetValue?: string,
  deadPlayers?: number[],
  onSetBoth?: (f: string, t: string) => void,
  playerCount?: number
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, popLeft: false });
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [isSliding, setIsSliding] = useState(false);
  const [gestureOrigin, setGestureOrigin] = useState<string | null>(null);
  const [gestureCurrent, setGestureCurrent] = useState<string | null>(null);
  const [slideAction, setSlideAction] = useState<'add' | 'remove' | null>(null);

  const updatePosition = useCallback(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const panelWidth = 280;
      const spaceRight = window.innerWidth - rect.right;
      const shouldPopLeft = spaceRight < (panelWidth + 20);
      setCoords({
        top: rect.top + rect.height / 2,
        left: shouldPopLeft ? rect.left - 10 : rect.right + 10,
        popLeft: shouldPopLeft
      });
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      updatePosition();
      const handleClose = () => { if(!isSliding) setIsOpen(false); };
      window.addEventListener('resize', handleClose);
      const handleClickOutside = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node) && !isSliding) setIsOpen(false);
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        window.removeEventListener('resize', handleClose);
      };
    }
  }, [isOpen, updatePosition, isSliding]);

  const toggleNumber = (num: number, forceAction?: 'add' | 'remove') => {
    const numStr = num.toString();
    if (!isMulti) {
      onChange(numStr);
      if (!onSetBoth) setIsOpen(false);
      return;
    }
    let currentVoters = value.split(',').filter(v => v !== "");
    const exists = currentVoters.includes(numStr);
    if (forceAction === 'remove' || (!forceAction && exists)) {
      currentVoters = currentVoters.filter(v => v !== numStr);
    } else {
      currentVoters = [...new Set([...currentVoters, numStr])].sort((a, b) => parseInt(a) - parseInt(b));
    }
    onChange(currentVoters.join(','));
  };

  const handleMouseUp = () => {
    if (onSetBoth && gestureOrigin && gestureCurrent && gestureOrigin !== gestureCurrent) {
      onSetBoth(gestureOrigin, gestureCurrent);
      setIsOpen(false);
    }
    setIsSliding(false);
    setGestureOrigin(null);
    setGestureCurrent(null);
  };

  const activeVoters = isMulti ? value.split(',').filter(v => v !== "") : [value];

  return (
    <div className="relative w-full h-full flex items-center justify-center" ref={containerRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full h-7 border rounded text-[10px] font-black flex items-center justify-center transition-all ${
          isOpen ? 'bg-slate-900 border-slate-900 text-white shadow-inner scale-95' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white shadow-sm'
        }`}
      >
        {isMulti ? (activeVoters.length || '-') : (value || '-')}
      </button>

      {isOpen && (
        <div 
          className={`fixed z-[9999] -translate-y-1/2 animate-in fade-in zoom-in-95 duration-150 select-none ${coords.popLeft ? 'origin-right' : 'origin-left'}`}
          style={{ 
            top: `${coords.top}px`,
            left: coords.popLeft ? 'auto' : `${coords.left}px`,
            right: coords.popLeft ? `${window.innerWidth - coords.left}px` : 'auto',
          }}
          onMouseUp={handleMouseUp}
        >
          <div className="bg-white p-1 rounded-full shadow-[0_30px_70px_rgba(0,0,0,0.5)] border border-slate-200 w-64 h-64 relative">
            <svg viewBox="0 0 288 288" className="w-full h-full">
              {Array.from({ length: playerCount }, (_, i) => i + 1).map((num, i) => {
                const numStr = num.toString();
                const isActive = activeVoters.includes(numStr);
                const isGestureOrigin = gestureOrigin === numStr;
                const isGestureCurrent = gestureCurrent === numStr;
                const isDead = deadPlayers.includes(num);

                let fill = isDead ? '#f8fafc' : '#ffffff';
                if (isGestureOrigin) fill = '#2563eb';
                else if (isGestureCurrent) fill = '#10b981';
                else if (isActive) fill = '#ef4444';
                else if (forValue === numStr) fill = '#3b82f6';
                else if (targetValue === numStr) fill = '#10b981';

                const angle = (i * (360/playerCount)) - 90 + (360/(playerCount * 2));
                const lx = 144 + 95 * Math.cos(angle * Math.PI / 180);
                const ly = 144 + 95 * Math.sin(angle * Math.PI / 180);

                return (
                  <g key={num} 
                    onMouseDown={(e) => { 
                      e.preventDefault(); 
                      setIsSliding(true); 
                      if (onSetBoth) { setGestureOrigin(numStr); setGestureCurrent(numStr); } 
                      else { setSlideAction(isActive ? 'remove' : 'add'); toggleNumber(num); }
                    }}
                    onMouseEnter={() => { 
                      if (isSliding) {
                        if (onSetBoth) setGestureCurrent(numStr);
                        else if (isMulti) toggleNumber(num, slideAction!);
                      }
                    }}
                  >
                    <path d={getSlicePath(i, playerCount, 50, 142)} fill={fill} stroke="#f1f5f9" strokeWidth="1" className="cursor-pointer hover:brightness-95 transition-all" />
                    <text x={lx} y={ly} textAnchor="middle" alignmentBaseline="middle" className={`text-[12px] font-black pointer-events-none ${isActive || isGestureOrigin || isGestureCurrent || forValue === numStr || targetValue === numStr ? 'fill-white' : isDead ? 'fill-slate-300' : 'fill-slate-600'}`}>
                      {num}
                    </text>
                  </g>
                );
              })}
            </svg>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className={`w-20 h-20 rounded-full flex flex-col items-center justify-center shadow-inner transition-colors ${onSetBoth && isSliding ? 'bg-red-600' : 'bg-slate-900'}`}>
                <span className="text-[6px] text-slate-400 font-black uppercase tracking-widest mb-0.5">{onSetBoth && isSliding ? 'SLIDE' : label}</span>
                <span className="text-white text-lg font-black leading-none">{onSetBoth && isSliding ? gestureCurrent : (isMulti ? activeVoters.length : value)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClockPicker;