"use client";

import React, { useMemo } from 'react';

interface Nomination {
  id: string;
  day: number;
  f: string;
  t: string;
  voters: string;
  note: string;
}

interface VoteHistoryClockProps {
  playerNo: number;
  nominations: Nomination[];
  mode: 'vote' | 'beVoted';
  playerCount: number;
}

const VoteHistoryClock: React.FC<VoteHistoryClockProps> = ({
  playerNo,
  nominations,
  mode,
  playerCount
}) => {
  const pStr = playerNo.toString();

  const history = useMemo(() => {
    if (!Array.isArray(nominations)) return [];
    
    return nominations.filter(nom => {
      if (!nom || typeof nom.voters !== 'string') return false;
      
      if (mode === 'vote') {
        // Did this player vote?
        return nom.voters.split(',').includes(pStr);
      } else {
        // Was this player nominated or for?
        return nom.t === pStr || nom.f === pStr;
      }
    });
  }, [nominations, mode, pStr]);

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-6 text-slate-300">
        <div className="text-[10px] font-black uppercase tracking-widest opacity-50">No History</div>
      </div>
    );
  }

  return (
    <div className="space-y-1 max-h-48 overflow-y-auto no-scrollbar pr-1">
      {history.map((nom) => {
        const isVoter = nom.voters.split(',').includes(pStr);
        const isFor = nom.f === pStr;
        const isTarget = nom.t === pStr;

        return (
          <div key={nom.id} className="bg-white border rounded p-1.5 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 bg-slate-900 text-white rounded flex items-center justify-center text-[8px] font-black">
                D{nom.day}
              </span>
              <div className="flex items-center gap-1">
                <span className={`px-1.5 py-0.5 rounded text-[8px] font-black ${isFor ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                  F{nom.f}
                </span>
                <span className="text-slate-300">→</span>
                <span className={`px-1.5 py-0.5 rounded text-[8px] font-black ${isTarget ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                  T{nom.t}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-black ${isVoter ? 'bg-red-500 text-white' : 'bg-slate-100 text-slate-300'}`}>
                {isVoter ? 'V' : '-'}
              </div>
              <span className="text-[9px] font-black text-slate-400 w-4 text-center">
                {nom.voters.split(',').filter(v => v !== "").length}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default VoteHistoryClock;