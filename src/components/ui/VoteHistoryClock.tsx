"use client";

import React from 'react';

interface VoteHistoryClockProps {
  playerNo: number;
  nominations: any[];
  voteHistoryMode: 'vote' | 'beVoted';
  deadPlayers: number[];
  deaths: any[];
  playerCount: number;
}

const VoteHistoryClock: React.FC<VoteHistoryClockProps> = ({
  playerNo,
  nominations,
  voteHistoryMode,
  deadPlayers,
  deaths,
  playerCount
}) => {
  const players = Array.from({ length: playerCount }, (_, i) => i + 1);

  return (
    <div className="relative w-64 h-64 mx-auto">
      <svg viewBox="0 0 288 288" className="w-full h-full">
        {players.map((num, i) => {
          const isDead = deadPlayers.includes(num);
          const death = deaths.find((d: any) => parseInt(d.playerNo) === num);
          const deathReason = death?.reason || '';
          const displayText = isDead ? deathReason : num.toString();

          const path = getSlicePath(i, playerCount, 50, 142);
          const angle = (i * (360 / playerCount)) - 90 + (360 / (playerCount * 2));
          const lx = 144 + 95 * Math.cos(angle * Math.PI / 180);
          const ly = 144 + 95 * Math.sin(angle * Math.PI / 180);

          return (
            <g key={num}>
              <path d={path} fill={isDead ? '#f8fafc' : '#ffffff'} stroke="#f1f5f9" strokeWidth="1" />
              <text x={lx} y={ly} textAnchor="middle" alignmentBaseline="middle" className={`text-[12px] font-black pointer-events-none ${isDead ? 'fill-slate-300' : 'fill-slate-600'}`}>
                {displayText}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-20 h-20 rounded-full bg-slate-900 flex items-center justify-center">
          <span className="text-white text-lg font-black">{playerNo}</span>
        </div>
      </div>
    </div>
  );
};

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

export default VoteHistoryClock;