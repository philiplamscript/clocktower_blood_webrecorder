"use client";

import React, { useState, useMemo } from 'react';
import { 
  Filter,
  Eye,
  Edit,
  Calendar,
  Users,
  Target,
  Hand
} from 'lucide-react';

import { type Nomination } from '../../type';

// Helper for pie paths
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

interface VoteHistoryClockProps {
  playerNo: number;
  nominations: Nomination[];
  onEditNomination?: (nomination: Nomination) => void;
}

const VoteHistoryClock: React.FC<VoteHistoryClockProps> = ({ playerNo, nominations, onEditNomination }) => {
  const [filter, setFilter] = useState<'all' | 'for' | 'target' | 'voter'>('all');
  const [selectedNomination, setSelectedNomination] = useState<Nomination | null>(null);

  const playerNominations = useMemo(() => {
    return nominations.filter(n => {
      const isFor = n.f === playerNo.toString();
      const isTarget = n.t === playerNo.toString();
      const isVoter = n.voters.split(',').includes(playerNo.toString());
      
      switch (filter) {
        case 'for': return isFor;
        case 'target': return isTarget;
        case 'voter': return isVoter;
        default: return isFor || isTarget || isVoter;
      }
    });
  }, [nominations, playerNo, filter]);

  const getRoleColor = (n: Nomination) => {
    const isFor = n.f === playerNo.toString();
    const isTarget = n.t === playerNo.toString();
    const isVoter = n.voters.split(',').includes(playerNo.toString());
    
    if (isFor) return '#3b82f6'; // Blue for For
    if (isTarget) return '#10b981'; // Green for Target
    if (isVoter) return '#ef4444'; // Red for Voter
    return '#f1f5f9'; // Default
  };

  const getRoleLabel = (n: Nomination) => {
    const isFor = n.f === playerNo.toString();
    const isTarget = n.t === playerNo.toString();
    const isVoter = n.voters.split(',').includes(playerNo.toString());
    
    if (isFor) return 'For';
    if (isTarget) return 'Target';
    if (isVoter) return 'Voter';
    return 'Unknown';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Vote History for Player {playerNo}</h3>
        <div className="flex items-center gap-2">
          <Filter size={12} className="text-slate-400" />
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value as any)} 
            className="text-[9px] bg-slate-50 border border-slate-200 rounded px-2 py-1"
          >
            <option value="all">All Roles</option>
            <option value="for">As For</option>
            <option value="target">As Target</option>
            <option value="voter">As Voter</option>
          </select>
        </div>
      </div>

      {playerNominations.length === 0 ? (
        <div className="text-center py-8 text-slate-400 text-[10px]">No nominations found for this filter.</div>
      ) : (
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="bg-white rounded border shadow-sm p-4">
              <svg viewBox="0 0 288 288" className="w-full h-64">
                {playerNominations.map((n, i) => {
                  const path = getSlicePath(i, playerNominations.length, 50, 142);
                  const angle = (i * (360 / playerNominations.length)) - 90 + (360 / (playerNominations.length * 2));
                  const lx = 144 + 95 * Math.cos(angle * Math.PI / 180);
                  const ly = 144 + 95 * Math.sin(angle * Math.PI / 180);

                  return (
                    <g key={n.id} 
                      onClick={() => setSelectedNomination(n)}
                      className="cursor-pointer hover:opacity-80 transition-opacity"
                    >
                      <path d={path} fill={getRoleColor(n)} stroke="#ffffff" strokeWidth="2" />
                      <text x={lx} y={ly} textAnchor="middle" alignmentBaseline="middle" className="text-[10px] font-black fill-white">
                        D{n.day}
                      </text>
                    </g>
                  );
                })}
              </svg>
              <div className="text-center mt-2 text-[8px] text-slate-500">
                Total Nominations: {playerNominations.length}
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-2">
            {selectedNomination ? (
              <div className="bg-slate-50 rounded border p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black text-slate-600">Nomination Details</span>
                  {onEditNomination && (
                    <button onClick={() => onEditNomination(selectedNomination)} className="text-blue-500 hover:text-blue-700">
                      <Edit size={12} />
                    </button>
                  )}
                </div>
                <div className="space-y-1 text-[9px]">
                  <div><strong>Day:</strong> {selectedNomination.day}</div>
                  <div><strong>For:</strong> {selectedNomination.f}</div>
                  <div><strong>Target:</strong> {selectedNomination.t}</div>
                  <div><strong>Voters:</strong> {selectedNomination.voters}</div>
                  <div><strong>Note:</strong> {selectedNomination.note || 'None'}</div>
                  <div><strong>Your Role:</strong> {getRoleLabel(selectedNomination)}</div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 rounded border p-3 text-center text-slate-400 text-[10px]">
                Click on a slice to view details
              </div>
            )}

            <div className="bg-white rounded border p-3">
              <div className="text-[10px] font-black text-slate-600 mb-2">Legend</div>
              <div className="space-y-1 text-[9px]">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <span>As For</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span>As Target</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded"></div>
                  <span>As Voter</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoteHistoryClock;