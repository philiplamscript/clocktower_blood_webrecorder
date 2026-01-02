import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { 
  Users, 
  Vote, 
  ShieldAlert, 
  FileText, 
  Plus, 
  Trash2, 
  Calendar,
  Zap,
  Skull, 
  RefreshCcw,
  AlertTriangle,
  Minus,
  Check,
  Megaphone,
  Target,
  Hand,
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
  X
} from 'lucide-react';

import {
  type Player,
  type Nomination,
  type Death,
  type Character,
  type CharDict,
  type SortConfig,
  
  INITIAL_PLAYERS,
  REASON_CYCLE,
  createInitialChars,
} from '../../type'

import { ReasonPicker, ClockPicker} from '../ClockPicker/ClockPicker';

// --- COMPONENT 4: DEATH LEDGER ---

const DeathLedger = ({ deaths, setDeaths, setPlayers, deadPlayers }: any) => {
  const sync = () => {
    setPlayers((prev: Player[]) => {
      let next = [...prev];
      deaths.forEach((d: Death) => {
        const num = parseInt(d.playerNo);
        if(!isNaN(num)) next = next.map(p => p.no === num ? { ...p, day: d.day.toString(), reason: d.reason } : p);
      });
      return next;
    });
    setDeaths(deaths.map((d: Death) => ({ ...d, isConfirmed: true })));
  };

  return (
    <div className="bg-white rounded border shadow-sm">
      <div className="bg-slate-900 px-3 py-2 flex justify-between items-center">
        <span className="text-white text-[9px] font-black uppercase tracking-widest">Death Ledger</span>
        <button onClick={sync} className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-[8px] font-black uppercase flex items-center gap-1 transition-all"><Check size={10} /> Sync All</button>
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-slate-100 border-b text-[8px] uppercase text-slate-500 font-black">
            <th className="w-10 py-2 border-r text-center">D</th>
            <th className="w-24 py-2 border-r text-center px-2">PLAYER</th>
            <th className="w-20 py-2 border-r text-center">REASON</th>
            <th className="py-2 px-3 text-left">NOTES</th>
            <th className="w-10 py-2 text-center border-l border-slate-100">X</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {deaths.map((d: Death) => (
            <tr key={d.id} className={`h-12 ${d.isConfirmed ? 'bg-green-50/20' : ''}`}>
              <td className="p-0 border-r border-slate-100"><input type="number" className="w-full text-center border-none bg-transparent focus:ring-0 text-[11px] font-black" value={d.day} onChange={(e) => setDeaths(deaths.map((it: any) => it.id === d.id ? { ...it, day: parseInt(e.target.value) || 1, isConfirmed: false } : it))} /></td>
              <td className="p-2 border-r border-slate-100"><ClockPicker label="DEAD" value={d.playerNo} deadPlayers={deadPlayers} onChange={(val) => setDeaths(deaths.map((it: any) => it.id === d.id ? { ...it, playerNo: val, isConfirmed: false } : it))} /></td>
              <td className="p-0 border-r border-slate-100 text-center">
                <ReasonPicker value={d.reason} onChange={(val) => setDeaths(deaths.map((it: any) => it.id === d.id ? { ...it, reason: val, isConfirmed: false } : it))} />
              </td>
              <td className="p-0 px-3 font-mono"><input placeholder="..." className="w-full border-none bg-transparent focus:ring-0 text-[10px]" value={d.note} onChange={(e) => setDeaths(deaths.map((it: any) => it.id === d.id ? { ...it, note: e.target.value, isConfirmed: false } : it))} /></td>
              <td className="p-0 text-center border-l border-slate-100"><button onClick={() => setDeaths(deaths.filter((it: any) => it.id !== d.id))} className="text-slate-200 hover:text-red-500"><Trash2 size={12} /></button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DeathLedger;