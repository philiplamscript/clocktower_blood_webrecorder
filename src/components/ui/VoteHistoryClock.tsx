"use client";

import React, { useMemo } from 'react';
import { Calendar, Vote } from 'lucide-react';
import { type Nomination } from '../../type';

interface VoteHistoryClockProps {
  nominations: Nomination[];
  playerNo: number;
  currentDay: number;
}

const VoteHistoryClock: React.FC<VoteHistoryClockProps> = ({ nominations, playerNo, currentDay }) => {
  const playerVotes = useMemo(() => {
    return nominations.filter(n => {
      const voters = n.voters.split(',').filter(v => v !== '');
      return voters.includes(playerNo.toString()) || n.f === playerNo.toString() || n.t === playerNo.toString();
    });
  }, [nominations, playerNo]);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Calendar size={12} className="text-slate-500" />
        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Vote History</span>
      </div>

      <div className="bg-slate-50 rounded border p-3 max-h-48 overflow-y-auto">
        {playerVotes.length === 0 ? (
          <div className="text-center text-slate-400 text-[10px] py-4">No votes recorded</div>
        ) : (
          <div className="space-y-2">
            {playerVotes.map((n) => {
              const voters = n.voters.split(',').filter(v => v !== '');
              const isVoter = voters.includes(playerNo.toString());
              const isFor = n.f === playerNo.toString();
              const isTarget = n.t === playerNo.toString();
              return (
                <div key={n.id} className="flex items-center gap-2 text-[9px] bg-white p-2 rounded shadow-sm">
                  <div className="font-mono text-slate-600">D{n.day}</div>
                  <div className="flex-1">
                    {isFor && <span className="text-blue-600 font-bold">FOR</span>}
                    {isTarget && <span className="text-emerald-600 font-bold ml-1">TARGET</span>}
                    {isVoter && <span className="text-red-600 font-bold ml-1">VOTED</span>}
                    {n.note && <span className="text-slate-500 ml-1">({n.note})</span>}
                  </div>
                  <div className="text-slate-400">{voters.length} votes</div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default VoteHistoryClock;