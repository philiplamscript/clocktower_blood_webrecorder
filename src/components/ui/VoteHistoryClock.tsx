"use client";

import React, { useMemo } from 'react';

interface VoteHistoryClockProps {
  playerNo: number;
  nominations: any[];
  deaths: any[];
  players: any[];
  voteHistoryMode: 'vote' | 'beVoted';
}

const VoteHistoryClock: React.FC<VoteHistoryClockProps> = ({ playerNo, nominations, deaths, players, voteHistoryMode }) => {
  const playerCount = players.length;

  // Calculate vote counts
  const voteCounts = useMemo(() => {
    const counts: { [key: number]: number } = {};
    nominations.forEach(nom => {
      const voters = nom.voters.split(',').filter(v => v !== "");
      const forPlayer = parseInt(nom.f);
      const targetPlayer = parseInt(nom.t);

      if (voteHistoryMode === 'vote') {
        // Count how many times this player voted for others
        voters.forEach(voter => {
          const voterNum = parseInt(voter);
          if (voterNum === playerNo) {
            if (targetPlayer && !isNaN(targetPlayer)) {
              counts[targetPlayer] = (counts[targetPlayer] || 0) + 1;
            }
          }
        });
      } else {
        // Count how many times others voted for this player
        if (targetPlayer === playerNo) {
          voters.forEach(voter => {
            const voterNum = parseInt(voter);
            if (!isNaN(voterNum)) {
              counts[voterNum] = (counts[voterNum] || 0) + 1;
            }
          });
        }
      }
    });
    return counts;
  }, [nominations, playerNo, voteHistoryMode]);

  const totalVotes = Object.values(voteCounts).reduce((sum, count) => sum + count, 0);

  // Helper for pie paths with multiple radii
  const getMultiLayerSlicePath = (index: number, total: number, innerRadius1: number, innerRadius2: number, outerRadius: number, cx: number = 200, cy: number = 200) => {
    const angleStep = 360 / total;
    const startAngle = (index * angleStep) - 90;
    const endAngle = ((index + 1) * angleStep) - 90;
    
    const polarToCartesian = (angle: number, radius: number) => ({
      x: cx + (radius * Math.cos(angle * Math.PI / 180)),
      y: cy + (radius * Math.sin(angle * Math.PI / 180))
    });

    const p1 = polarToCartesian(startAngle, outerRadius);
    const p2 = polarToCartesian(endAngle, outerRadius);
    const p3 = polarToCartesian(endAngle, innerRadius2);
    const p4 = polarToCartesian(startAngle, innerRadius2);
    const p5 = polarToCartesian(startAngle, innerRadius1);
    const p6 = polarToCartesian(endAngle, innerRadius1);

    const largeArcFlag = angleStep > 180 ? 1 : 0;

    // Outer ring
    const outerPath = `M ${p1.x} ${p1.y} A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${p2.x} ${p2.y} L ${p3.x} ${p3.y} A ${innerRadius2} ${innerRadius2} 0 ${largeArcFlag} 0 ${p4.x} ${p4.y} Z`;
    // Middle ring
    const middlePath = `M ${p4.x} ${p4.y} A ${innerRadius2} ${innerRadius2} 0 ${largeArcFlag} 1 ${p3.x} ${p3.y} L ${p6.x} ${p6.y} A ${innerRadius1} ${innerRadius1} 0 ${largeArcFlag} 0 ${p5.x} ${p5.y} Z`;
    // Inner ring
    const innerPath = `M ${p5.x} ${p5.y} A ${innerRadius1} ${innerRadius1} 0 ${largeArcFlag} 1 ${p6.x} ${p6.y} L ${p6.x} ${p6.y} A 0 0 0 0 0 ${p5.x} ${p5.y} Z`; // Tiny center

    return { outerPath, middlePath, innerPath };
  };

  const playersList = Array.from({ length: playerCount }, (_, i) => i + 1);

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Vote Count Display */}
      <div className="text-center">
        <div className="text-[12px] font-black text-slate-600 uppercase tracking-widest">
          {voteHistoryMode === 'vote' ? 'VOTES CAST' : 'VOTES RECEIVED'}
        </div>
        <div className="text-[24px] font-black text-slate-800">{totalVotes}</div>
        {totalVotes > 0 && (
          <div className="text-[10px] text-slate-500">
            {voteHistoryMode === 'vote' ? 'for others' : 'from others'}
          </div>
        )}
      </div>

      {/* Pie Chart */}
      <div className="w-full max-w-[80vw] max-h-[80vw] aspect-square">
        <svg viewBox="0 0 400 400" className="w-full h-full">
          {playersList.map((num, i) => {
            const voteCount = voteCounts[num] || 0;
            const isDead = deaths.some(d => parseInt(d.playerNo) === num);
            const death = deaths.find(d => parseInt(d.playerNo) === num);
            const deathReason = death?.reason || '';
            const property = players.find(p => p.no === num)?.property || '';

            const { outerPath, middlePath, innerPath } = getMultiLayerSlicePath(i, playerCount, 40, 100, 180);

            const fillOpacity = voteCount > 0 ? 0.8 : 0.1;
            const strokeColor = voteCount > 0 ? '#ef4444' : '#f1f5f9';

            return (
              <g key={num}>
                {/* Outer layer: Property */}
                <path d={outerPath} fill={voteCount > 0 ? '#3b82f6' : '#ffffff'} fillOpacity={fillOpacity} stroke={strokeColor} strokeWidth="1" />
                <text
                  x={200 + 140 * Math.cos(((i * (360 / playerCount)) - 90 + (360 / (playerCount * 2))) * Math.PI / 180)}
                  y={200 + 140 * Math.sin(((i * (360 / playerCount)) - 90 + (360 / (playerCount * 2))) * Math.PI / 180)}
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  className="text-[8px] font-black fill-white"
                >
                  {property}
                </text>

                {/* Middle layer: Player Number */}
                <path d={middlePath} fill={voteCount > 0 ? '#10b981' : '#f8fafc'} fillOpacity={fillOpacity} stroke={strokeColor} strokeWidth="1" />
                <text
                  x={200 + 70 * Math.cos(((i * (360 / playerCount)) - 90 + (360 / (playerCount * 2))) * Math.PI / 180)}
                  y={200 + 70 * Math.sin(((i * (360 / playerCount)) - 90 + (360 / (playerCount * 2))) * Math.PI / 180)}
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  className={`text-[10px] font-black ${voteCount > 0 ? 'fill-white' : 'fill-slate-600'}`}
                >
                  {num}
                </text>

                {/* Inner layer: Death Reason */}
                <path d={innerPath} fill={isDead ? '#dc2626' : '#ffffff'} fillOpacity={isDead ? 0.9 : 0.1} stroke={strokeColor} strokeWidth="1" />
                <text
                  x={200 + 20 * Math.cos(((i * (360 / playerCount)) - 90 + (360 / (playerCount * 2))) * Math.PI / 180)}
                  y={200 + 20 * Math.sin(((i * (360 / playerCount)) - 90 + (360 / (playerCount * 2))) * Math.PI / 180)}
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  className="text-[6px] font-black fill-white"
                >
                  {deathReason}
                </text>

                {/* Vote count indicator */}
                {voteCount > 0 && (
                  <text
                    x={200 + 160 * Math.cos(((i * (360 / playerCount)) - 90 + (360 / (playerCount * 2))) * Math.PI / 180)}
                    y={200 + 160 * Math.sin(((i * (360 / playerCount)) - 90 + (360 / (playerCount * 2))) * Math.PI / 180)}
                    textAnchor="middle"
                    alignmentBaseline="middle"
                    className="text-[12px] font-black fill-red-600"
                  >
                    {voteCount}
                  </text>
                )}
              </g>
            );
          })}
          {/* Center circle */}
          <circle cx="200" cy="200" r="30" fill="#1e293b" />
          <text x="200" y="200" textAnchor="middle" alignmentBaseline="middle" className="text-[10px] font-black fill-white">
            {playerNo}
          </text>
        </svg>
      </div>
    </div>
  );
};

export default VoteHistoryClock;