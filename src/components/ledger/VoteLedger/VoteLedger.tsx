"use client";

import React from 'react';
import { 
  Trash2, 
  Megaphone,
  Target,
  Hand
} from 'lucide-react';

import { type Nomination } from '../../../type';
import { ClockPicker } from '../../pickers/ClockPicker/ClockPicker';

const VoteLedger = ({ 
  nominations, 
  setNominations,
  isDragging,
  setIsDragging,
  dragAction,
  setDragAction,
  lastDraggedPlayer,
  setLastDraggedPlayer,
  deadPlayers,
  playerCount = 15
}: any) => {
  const toggleVoter = (nominationId: string, playerNo: number, forceAction?: 'add' | 'remove') => {
    setNominations(nominations.map((n: Nomination) => {
      if (n.id !== nominationId) return n;
      const playerStr = playerNo.toString();
      let voters = n.voters.split(',').filter(v => v !== "");
      const hasVote = voters.includes(playerStr);
      if (forceAction === 'remove' || (!forceAction && hasVote)) voters = voters.filter(v => v !== playerStr);
      else if (forceAction === 'add' || (!forceAction && !hasVote)) voters = [...new Set([...voters, playerStr])].sort((a, b) => parseInt(a) - parseInt(b));
      return { ...n, voters: voters.join(',') };
    }));
  };

  // Players 1..N for voting grid
  const votingPlayers = Array.from({ length: playerCount }, (_, i) => i + 1);

  return (
    <div className="bg-white rounded border shadow-sm overflow-x-auto">
      <table className="w-full border-collapse table-fixed min-w-[900px]">
        <thead>
          <tr className="bg-slate-100 border-b text-[8px] uppercase text-slate-500 font-black">
            <th className="w-6 py-2 border-r text-center">D</th>
            <th className="w-8 py-2 border-r text-center text-slate-400"><Megaphone size={12} className="mx-auto" /></th>
            <th className="w-8 py-2 border-r text-center text-slate-400"><Target size={12} className="mx-auto" /></th>
            <th className="w-10 py-2 border-r text-center text-slate-400"><Hand size={12} className="mx-auto" /></th>
            <th className="w-8 py-2 border-r text-center">VCT</th>
            <th className="p-0">
              <div className="flex h-full">
                {votingPlayers.map(num => (
                  <div key={num} className="flex-1 border-r text-[7px] text-center py-2 text-slate-400">{num}</div>
                ))}
              </div>
            </th>
            <th className="w-24 py-2 px-2">NOTES</th>
            <th className="w-6 py-2"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 font-mono">
          {nominations.map((n: Nomination) => (
            <tr key={n.id} className="h-10">
              <td className="p-0 border-r border-slate-100"><input type="number" className="w-full text-center border-none bg-transparent focus:ring-0 text-[10px] p-0 font-bold" value={n.day} onChange={(e) => setNominations(nominations.map((item: any) => item.id === n.id ? { ...item, day: parseInt(e.target.value) || 1 } : item))} /></td>
              <td className="p-0.5 border-r border-slate-100">
                <ClockPicker playerCount={playerCount} label="F" value={n.f} deadPlayers={deadPlayers} onChange={(val) => setNominations(nominations.map((item: any) => item.id === n.id ? { ...item, f: val } : item))} onSetBoth={(f, t) => setNominations(nominations.map((item: any) => item.id === n.id ? { ...item, f, t } : item))} allowSlide={true} />
              </td>
              <td className="p-0.5 border-r border-slate-100">
                <ClockPicker playerCount={playerCount} label="T" value={n.t} deadPlayers={deadPlayers} onChange={(val) => setNominations(nominations.map((item: any) => item.id === n.id ? { ...item, t: val } : item))} onSetBoth={(f, t) => setNominations(nominations.map((item: any) => item.id === n.id ? { ...item, f, t } : item))} allowSlide={true} />
              </td>
              <td className="p-0.5 border-r border-slate-100"><ClockPicker playerCount={playerCount} label="V" isMulti value={n.voters} forValue={n.f} targetValue={n.t} deadPlayers={deadPlayers} onChange={(val) => setNominations(nominations.map((item: any) => item.id === n.id ? { ...item, voters: val } : item))} /></td>
              <td className="p-0 border-r border-slate-100 text-center text-[10px] font-black">{n.voters.split(',').filter(v => v !== "").length}</td>
              <td className="p-0">
                <div className="flex h-10">
                  {votingPlayers.map((num) => {
                    const isActive = n.voters.split(',').includes(num.toString());
                    const isFor = n.f === num.toString();
                    const isTarget = n.t === num.toString();
                    const isDead = deadPlayers.includes(num);
                    return (
                      <div 
                        key={num} 
                        onMouseDown={() => { setIsDragging(true); setDragAction(isActive ? 'remove' : 'add'); setLastDraggedPlayer(num); toggleVoter(n.id, num); }}
                        onMouseEnter={() => { if (isDragging && num !== lastDraggedPlayer) { setLastDraggedPlayer(num); toggleVoter(n.id, num, dragAction!); } }}
                        className={`flex-1 border-r border-slate-50 h-full flex items-center justify-center text-[9px] font-black cursor-crosshair transition-all ${
                          isActive ? 'bg-red-500 text-white shadow-inner' : isFor ? 'bg-blue-50/50 text-blue-400' : isTarget ? 'bg-emerald-50/50 text-emerald-400' : isDead ? 'bg-slate-50 text-slate-200' : 'bg-white text-transparent hover:bg-slate-50'
                        }`}
                      >
                        {isActive ? 'V' : isFor ? 'F' : isTarget ? 'T' : isDead ? 'X' : ''}
                      </div>
                    );
                  })}
                </div>
              </td>
              <td className="p-0 border-l border-slate-100"><input placeholder="..." className="w-full border-none bg-transparent focus:ring-0 text-[9px] px-2 h-10 font-sans" value={n.note} onChange={(e) => setNominations(nominations.map((item: any) => item.id === n.id ? { ...item, note: e.target.value } : item))} /></td>
              <td className="p-0 text-center border-l border-slate-100"><button onClick={() => setNominations(nominations.filter((nom: any) => nom.id !== n.id))} className="text-slate-200 hover:text-red-500"><Trash2 size={12} /></button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VoteLedger;