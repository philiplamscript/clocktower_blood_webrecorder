"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';

import { 
  Skull,
} from 'lucide-react';

// Assuming VoteHistoryClock is similar to ClockPicker but for displaying vote history
// This is a placeholder implementation based on the ClockPicker structure, adapted for vote history

const VoteHistoryClock = ({ 
  playerCount = 15,
  voteHistory = [], // Array of vote data, e.g., [{ day: 1, votes: [1,2,3] }, ...]
  selectedPlayer = null
}: { 
  playerCount?: number,
  voteHistory?: any[],
  selectedPlayer?: number | null
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  
  const updatePosition = useCallback(() => {
    // Position logic if needed, similar to ClockPicker
  }, []);

  useEffect(() => {
    if (isOpen) {
      updatePosition();
      window.addEventListener('resize', updatePosition);
      const handleClickOutside = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setIsOpen(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [isOpen, updatePosition]);

  // Calculate size as 80% of window in square
  const pickerSize = Math.min(window.innerWidth * 0.8, window.innerHeight * 0.8);

  const players = Array.from({ length: playerCount }, (_, i) => i + 1);

  // Helper for pie paths (same as ClockPicker)
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

  return (
    <div className="relative w-full h-full flex items-center justify-center" ref={containerRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full h-7 border rounded text-[10px] font-black flex items-center justify-center transition-all ${
          isOpen ? 'bg-slate-900 border-slate-900 text-white shadow-inner scale-95' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white shadow-sm'
        }`}
      >
        Vote History
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[9998]" onClick={() => setIsOpen(false)} />
          
          <div 
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-in fade-in zoom-in-95 duration-150 select-none"
            style={{ width: `${pickerSize}px`, height: `${pickerSize}px` }}
          >
            <div 
              className="bg-white p-1 rounded-full shadow-[0_30px_70px_rgba(0,0,0,0.5)] border border-slate-200 relative"
              style={{ width: `${pickerSize}px`, height: `${pickerSize}px` }}
            >
              <svg 
                ref={svgRef}
                viewBox="0 0 288 288" 
                className="w-full h-full"
              >
                {players.map((num, i) => {
                  const numStr = num.toString();
                  const isSelected = selectedPlayer === num;
                  const hasVoted = voteHistory.some(day => day.votes.includes(num)); // Example logic
                  
                  let fill = hasVoted ? '#ef4444' : '#ffffff';
                  let stroke = '#f1f5f9';
                  
                  if (isSelected) fill = '#3b82f6';

                  const path = getSlicePath(i, playerCount, 50, 142);
                  const angle = (i * (360/playerCount)) - 90 + (360/(playerCount * 2));
                  const lx = 144 + 95 * Math.cos(angle * Math.PI / 180);
                  const ly = 144 + 95 * Math.sin(angle * Math.PI / 180);

                  return (
                    <g key={num}>
                      <path d={path} fill={fill} stroke={stroke} strokeWidth="1" />
                      <text x={lx} y={ly} textAnchor="middle" alignmentBaseline="middle" className={`text-[12px] font-black pointer-events-none ${isSelected || hasVoted ? 'fill-white' : 'fill-slate-600'}`}>
                        {num}
                      </text>
                    </g>
                  );
                })}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-20 h-20 rounded-full flex flex-col items-center justify-center shadow-inner bg-slate-900">
                  <span className="text-[6px] text-slate-400 font-black uppercase tracking-widest mb-0.5">HISTORY</span>
                  <span className="text-white text-lg font-black leading-none">{selectedPlayer || '-'}</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default VoteHistoryClock;