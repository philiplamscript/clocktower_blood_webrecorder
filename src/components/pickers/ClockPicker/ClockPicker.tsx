"use client";

import  { useState,  useRef, useEffect, useCallback } from 'react';


import { 
  Skull,
} from 'lucide-react';

import {REASON_CYCLE} from '../../../type';

// --- HELPER FOR PIE PATHS ---
const getSlicePath = (index: number, total: number, innerRadius: number, outerRadius: number, cx: number = 144, cy: number = 144) => {
  const angleStep = 360 / total;
  const startAngle = (index * angleStep) - 90;
  const endAngle = ((index + 1) * angleStep) - 90;
  
  const polarToCartesian = (angle: number, radius: number) => {
    const rad = (angle * Math.PI) / 180.0;
    return {
      x: cx + (radius * Math.cos(rad)),
      y: cy + (radius * Math.sin(rad))
    };
  };

  const p1 = polarToCartesian(startAngle, outerRadius);
  const p2 = polarToCartesian(endAngle, outerRadius);
  const p3 = polarToCartesian(endAngle, innerRadius);
  const p4 = polarToCartesian(startAngle, innerRadius);

  const largeArcFlag = angleStep > 180 ? 1 : 0;

  return `M ${p1.x} ${p1.y} A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${p2.x} ${p2.y} L ${p3.x} ${p3.y} A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${p4.x} ${p4.y} Z`;
};



// --- COMPONENT 1: PIE-CHART CLOCK PICKER ---

const ClockPicker = ({ 
  value, 
  onChange, 
  label, 
  isMulti = false,
  forValue = "",
  targetValue = "",
  deadPlayers = [],
  onSetBoth,
  playerCount = 15,
  allowSlide = false
}: { 
  value: string, 
  onChange: (val: string) => void, 
  label?: string,
  isMulti?: boolean,
  forValue?: string,
  targetValue?: string,
  deadPlayers?: number[],
  onSetBoth?: (f: string, t: string) => void,
  playerCount?: number,
  allowSlide?: boolean
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, popLeft: false });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  
  const [isSliding, setIsSliding] = useState(false);
  const [gestureOrigin, setGestureOrigin] = useState<string | null>(null);
  const [gestureCurrent, setGestureCurrent] = useState<string | null>(null);
  const [slideAction, setSlideAction] = useState<'add' | 'remove' | null>(null);
  const [hasMoved, setHasMoved] = useState(false);

  const updatePosition = useCallback(() => {
    const mobile = window.innerWidth < 640;
    setIsMobile(mobile);
    
    if (containerRef.current && !mobile) {
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
      window.addEventListener('resize', updatePosition);
      const handleClickOutside = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node) && !isSliding) {
          setIsOpen(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        window.removeEventListener('resize', updatePosition);
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
    if (forceAction === 'remove' || (!forceAction && exists)) currentVoters = currentVoters.filter(v => v !== numStr);
    else if (forceAction === 'add' || (!forceAction && !exists)) currentVoters = [...new Set([...currentVoters, numStr])].sort((a, b) => parseInt(a) - parseInt(b));
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
    setSlideAction(null);
    setHasMoved(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setHasMoved(true);
    if (!isSliding || !svgRef.current) return;
    const touch = e.touches[0];
    const rect = svgRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    
    const dx = touch.clientX - cx;
    const dy = touch.clientY - cy;
    let angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
    if (angle < 0) angle += 360;
    
    const index = Math.floor(angle / (360 / playerCount));
    const num = (index % playerCount) + 1;
    const numStr = num.toString();

    if (onSetBoth) {
      if (numStr !== gestureCurrent) setGestureCurrent(numStr);
    } else if (isMulti) {
      if (numStr !== gestureCurrent) {
        setGestureCurrent(numStr);
        toggleNumber(num, slideAction!);
      }
    } else if (allowSlide) {
      if (numStr !== gestureCurrent) {
        setGestureCurrent(numStr);
        onChange(numStr);
      }
    }
  };

  const handleTouchEnd = (num: number) => {
    if (!hasMoved) {
      toggleNumber(num);
    }
    handleMouseUp();
  };

  const handleMouseEnter = (num: number) => {
    if (isSliding) {
      const numStr = num.toString();
      if (onSetBoth) {
        if (numStr !== gestureCurrent) setGestureCurrent(numStr);
      } else if (isMulti) {
        if (numStr !== gestureCurrent) {
          setGestureCurrent(numStr);
          toggleNumber(num, slideAction!);
        }
      } else if (allowSlide) {
        if (numStr !== gestureCurrent) {
          setGestureCurrent(numStr);
          onChange(numStr);
        }
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsOpen(!isOpen);
    }
  };

  const players = Array.from({ length: playerCount }, (_, i) => i + 1);
  const activeVoters = isMulti ? value.split(',').filter(v => v !== "") : [value];

  const pickerSize = isMobile ? Math.min(window.innerWidth * 0.8, window.innerHeight * 0.8) : 256;

  return (
    <div className="relative w-full h-full flex items-center justify-center" ref={containerRef}>
      <button 
        tabIndex={0}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        className={`w-full h-7 border rounded text-[10px] font-black flex items-center justify-center transition-all ${
          isOpen ? 'bg-slate-900 border-slate-900 text-white shadow-inner scale-95' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white shadow-sm'
        }`}
      >
        {isMulti ? (activeVoters.length || '-') : (value || '-')}
      </button>

      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          {isMobile && <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[9998]" onClick={() => setIsOpen(false)} />}
          
          <div 
            className={`fixed z-[9999] animate-in fade-in zoom-in-95 duration-150 select-none ${
              isMobile 
                ? 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' 
                : `-translate-y-1/2 ${coords.popLeft ? 'origin-right' : 'origin-left'}`
            }`}
            style={isMobile ? {} : { 
              top: `${coords.top}px`,
              left: coords.popLeft ? 'auto' : `${coords.left}px`,
              right: coords.popLeft ? `${window.innerWidth - coords.left}px` : 'auto',
            }}
            onMouseUp={handleMouseUp}
            onTouchEnd={handleMouseUp}
          >
            <div 
              className="bg-white p-1 rounded-full shadow-[0_30px_70px_rgba(0,0,0,0.5)] border border-slate-200 relative"
              style={{ width: `${pickerSize}px`, height: `${pickerSize}px` }}
            >
              <svg 
                ref={svgRef}
                viewBox="0 0 288 288" 
                className="w-full h-full touch-none"
                onTouchMove={handleTouchMove}
              >
                {players.map((num, i) => {
                  const numStr = num.toString();
                  const isActive = activeVoters.includes(numStr);
                  const isFor = forValue === numStr;
                  const isTarget = targetValue === numStr;
                  const isDead = deadPlayers.includes(num);
                  const isGestureOrigin = gestureOrigin === numStr;
                  const isGestureCurrent = gestureCurrent === numStr;

                  let fill = isDead ? '#f8fafc' : '#ffffff';
                  let stroke = '#f1f5f9';
                  
                  if (isGestureOrigin) fill = '#2563eb';
                  else if (isGestureCurrent) fill = '#10b981';
                  else if (isActive) fill = '#ef4444';
                  else if (isFor) fill = '#3b82f6';
                  else if (isTarget) fill = '#10b981';

                  const path = getSlicePath(i, playerCount, 50, 142);
                  const angle = (i * (360/playerCount)) - 90 + (360/(playerCount * 2));
                  const lx = 144 + 95 * Math.cos(angle * Math.PI / 180);
                  const ly = 144 + 95 * Math.sin(angle * Math.PI / 180);

                  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
                    e.preventDefault(); 
                    setIsSliding(true); 
                    setHasMoved(false);
                    if (onSetBoth) { 
                      setGestureOrigin(numStr); 
                      setGestureCurrent(numStr); 
                    } else if (isMulti) { 
                      const action = isActive ? 'remove' : 'add';
                      setSlideAction(action); 
                      setGestureCurrent(numStr);
                    } else if (allowSlide) {
                      setGestureCurrent(numStr);
                      onChange(numStr);
                    }
                  };

                  const handleClick = (e: React.MouseEvent | React.TouchEvent) => {
                    if (!isSliding) {
                      toggleNumber(num);
                    }
                  };

                  return (
                    <g key={num} 
                      onMouseDown={handleStart}
                      onTouchStart={handleStart}
                      onTouchEnd={() => handleTouchEnd(num)}
                      onMouseEnter={() => handleMouseEnter(num)}
                      onClick={handleClick}
                    >
                      <path d={path} fill={fill} stroke={stroke} strokeWidth="1" className="cursor-pointer hover:brightness-95 transition-all" />
                      <text x={lx} y={ly} textAnchor="middle" alignmentBaseline="middle" className={`text-[12px] font-black pointer-events-none ${isActive || isFor || isTarget || isGestureOrigin || isGestureCurrent ? 'fill-white' : isDead ? 'fill-slate-300' : 'fill-slate-600'}`}>
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
        </>
      )}
    </div>
  );
};

// --- COMPONENT 2: CIRCULAR REASON PICKER ---

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


export { ReasonPicker, ClockPicker };