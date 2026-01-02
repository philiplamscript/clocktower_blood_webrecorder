"use client";

import React from 'react';

interface VoteHistoryClockProps {
  playerNo: number;
  nominations: any[];
  playerCount: number;
  deadPlayers: number[];
  mode: 'vote' | 'beVoted';
}

const VoteHistoryClock: React.FC<VoteHistoryClockProps> = ({ playerNo, nominations, playerCount, deadPlayers, mode }) => {
  const playerStr = playerNo.toString();
  const votedToCounts: { [key: string]: number } = {};
  const nominatedCounts: { [key: string]: number } = {};
  const nominatedByCounts: { [key: string]: number } = {};
  const nominatedArrows: { from: number, to: number }[] = [];
  const nominatedByArrows: { from: number, to: number }[] = [];

  nominations.forEach(n => {
    if (n.voters.includes(playerStr) && n.t && n.t !== '-') {
      votedToCounts[n.t] = (votedToCounts[n.t] || 0) + 1;
    }
    if (n.f === playerStr && n.t && n.t !== '-') {
      nominatedCounts[n.t] = (nominatedCounts[n.t] || 0) + 1;
      nominatedArrows.push({ from: playerNo, to: parseInt(n.t) });
    }
    if (n.t === playerStr && n.f && n.f !== '-') {
      nominatedByCounts[n.f] = (nominatedByCounts[n.f] || 0) + 1;
      nominatedByArrows.push({ from: parseInt(n.f), to: playerNo });
    }
  });

  const counts = mode === 'vote' ? votedToCounts : nominatedByCounts;
  const maxCount = Math.max(...Object.values(counts), 1);

  const players = Array.from({ length: playerCount }, (_, i) => i + 1);
  const cx = 144, cy = 144, outerRadius = 142, innerRadius = 50;

  const getSlicePath = (index: number, total: number) => {
    const angleStep = 360 / total;
    const startAngle = (index * angleStep) - 90;
    const endAngle = ((index + 1) * angleStep) - 90;
    const polarToCartesian = (angle: number, radius: number) => ({
      x: cx + (radius * Math.cos(angle * Math.PI / 180)),
      y: cy + (radius * Math.sin(angle * Math.PI / 180))
    });
    const p1 = polarToCartesian(startAngle, outerRadius);
    const p2 = polarToCartesian(endAngle, outerRadius);
    const p3 = polarToCartesian(endAngle, innerRadius);
    const p4 = polarToCartesian(startAngle, innerRadius);
    const largeArcFlag = angleStep > 180 ? 1 : 0;
    return `M ${p1.x} ${p1.y} A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${p2.x} ${p2.y} L ${p3.x} ${p3.y} A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${p4.x} ${p4.y} Z`;
  };

  const getPosition = (num: number) => {
    const index = num - 1;
    const angle = (index * (360 / playerCount)) - 90 + (360 / (playerCount * 2));
    const rad = 95;
    return {
      x: cx + rad * Math.cos(angle * Math.PI / 180),
      y: cy + rad * Math.sin(angle * Math.PI / 180)
    };
  };

  const drawArrow = (from: number, to: number, color: string) => {
    const fromPos = getPosition(from);
    const toPos = getPosition(to);
    const dx = toPos.x - fromPos.x;
    const dy = toPos.y - fromPos.y;
    const angle = Math.atan2(dy, dx);
    const headLength = 8;
    const headX = toPos.x - headLength * Math.cos(angle);
    const headY = toPos.y - headLength * Math.sin(angle);
    const leftX = headX - headLength * Math.cos(angle - Math.PI / 6);
    const leftY = headY - headLength * Math.sin(angle - Math.PI / 6);
    const rightX = headX - headLength * Math.cos(angle + Math.PI / 6);
    const rightY = headY - headLength * Math.sin(angle + Math.PI / 6);
    return (
      <g key={`${from}-${to}`}>
        <line x1={fromPos.x} y1={fromPos.y} x2={headX} y2={headY} stroke={color} strokeWidth="2" />
        <polygon points={`${headX},${headY} ${leftX},${leftY} ${rightX},${rightY}`} fill={color} />
      </g>
    );
  };

  return (
    <div className="w-full flex justify-center">
      <svg viewBox="0 0 288 288" className="w-32 h-32">
        {players.map((num, i) => {
          const numStr = num.toString();
          const intensity = counts[numStr] ? counts[numStr] / maxCount : 0;
          const isDead = deadPlayers.includes(num);
          const fill = isDead ? '#f8fafc' : intensity > 0 ? `rgba(239, 68, 68, ${intensity})` : '#ffffff';
          const stroke = '#f1f5f9';
          const path = getSlicePath(i, playerCount);
          const pos = getPosition(num);
          return (
            <g key={num}>
              <path d={path} fill={fill} stroke={stroke} strokeWidth="1" />
              <text x={pos.x} y={pos.y} textAnchor="middle" alignmentBaseline="middle" className={`text-[12px] font-black pointer-events-none ${intensity > 0 || isDead ? 'fill-white' : 'fill-slate-600'}`}>
                {num}
              </text>
            </g>
          );
        })}
        {/* Arrows for nominated */}
        {nominatedArrows.map(arrow => drawArrow(arrow.from, arrow.to, '#10b981'))}
        {/* Arrows for nominated by */}
        {nominatedByArrows.map(arrow => drawArrow(arrow.from, arrow.to, '#ef4444'))}
        <circle cx={cx} cy={cy} r="20" fill="#0f172a" />
        <text x={cx} y={cy - 5} textAnchor="middle" className="text-white text-[10px] font-black">{playerNo}</text>
        <text x={cx} y={cy + 5} textAnchor="middle" className="text-white text-[6px] font-black uppercase">{mode === 'vote' ? 'VOTE' : 'BE VOTED'}</text>
      </svg>
    </div>
  );
};

export default VoteHistoryClock;