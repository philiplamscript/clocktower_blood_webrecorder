import React from 'react';
import { 
  Trash2,
} from 'lucide-react';

import {
  type Death,
} from '../../type'

import { ReasonPicker, ClockPicker} from '../ClockPicker/ClockPicker';

// --- COMPONENT 4: DEATH LEDGER ---

const DeathLedger = ({ deaths, setDeaths, deadPlayers, playerCount }: any) => {
  return (
    <div className="bg-white rounded border shadow-sm">
      <div className="bg-slate-900 px-3 py-2">
        <span className="text-white text-[9px] font-black uppercase tracking-widest">Death Ledger</span>
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-slate-100 border-b text-[8px] uppercase text-slate-500 font-black">
            <th className="w-8 py-2 border-r text-center">D</th>
            <th className="w-20 py-2 border-r text-center px-2">PLAYER</th>
            <th className="w-16 py-2 border-r text-center">REASON</th>
            <th className="py-2 px-3 text-left">NOTES</th>
            <th className="w-8 py-2 text-center border-l border-slate-100">X</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {deaths.map((d: Death) => (
            <tr key={d.id} className="h-12">
              <td className="p-0 border-r border-slate-100"><input type="number" className="w-full text-center border-none bg-transparent focus:ring-0 text-[11px] font-black" value={d.day} onChange={(e) => setDeaths(deaths.map((it: any) => it.id === d.id ? { ...it, day: parseInt(e.target.value) || 1 } : it))} /></td>
              <td className="p-1 border-r border-slate-100"><ClockPicker playerCount={playerCount} label="D" value={d.playerNo} deadPlayers={deadPlayers} onChange={(val) => setDeaths(deaths.map((it: any) => it.id === d.id ? { ...it, playerNo: val } : it))} /></td>
              <td className="p-0 border-r border-slate-100 text-center">
                <ReasonPicker value={d.reason} onChange={(val) => setDeaths(deaths.map((it: any) => it.id === d.id ? { ...it, reason: val } : it))} />
              </td>
              <td className="p-0 px-3 font-mono"><input placeholder="..." className="w-full border-none bg-transparent focus:ring-0 text-[10px]" value={d.note} onChange={(e) => setDeaths(deaths.map((it: any) => it.id === d.id ? { ...it, note: e.target.value } : it))} /></td>
              <td className="p-0 text-center border-l border-slate-100"><button onClick={() => setDeaths(deaths.filter((it: any) => it.id !== d.id))} className="text-slate-200 hover:text-red-500"><Trash2 size={12} /></button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DeathLedger;