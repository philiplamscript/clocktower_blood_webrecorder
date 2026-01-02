import  { useState, useMemo, useRef, useEffect, useCallback } from 'react';

import { 
  Calendar,
  Zap,
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
  Skull,
} from 'lucide-react';

import {type Player,
  type SortConfig,
} from '../../type'

// --- COMPONENT 2: PLAYER DATA GRID ---

export const PlayerGrid = ({ players, setPlayers }: { players: Player[], setPlayers: React.Dispatch<React.SetStateAction<Player[]>> }) => {
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'asc' });

  const handleSort = (key: keyof Player) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedPlayers = useMemo(() => {
    const items = [...players];
    if (sortConfig.key !== null) {
      items.sort((a, b) => {
        let valA: any = a[sortConfig.key!];
        let valB: any = b[sortConfig.key!];

        if (sortConfig.key === 'no' || sortConfig.key === 'day') {
          const numA = parseInt(valA) || 0;
          const numB = parseInt(valB) || 0;
          return sortConfig.direction === 'asc' ? numA - numB : numB - numA;
        }

        valA = valA.toString().toLowerCase();
        valB = valB.toString().toLowerCase();
        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return items;
  }, [players, sortConfig]);

  const SortIcon = ({ column }: { column: keyof Player }) => {
    if (sortConfig.key !== column) return <ArrowUpDown size={8} className="ml-1 opacity-20" />;
    return sortConfig.direction === 'asc' ? <ChevronUp size={8} className="ml-1 text-red-500" /> : <ChevronDown size={8} className="ml-1 text-red-500" />;
  };

  const updatePlayer = (no: number, field: keyof Player, value: string) => {
    setPlayers(prev => prev.map(p => p.no === no ? { ...p, [field]: value } : p));
  };

  return (
    <div className="bg-white rounded border shadow-sm overflow-hidden">
      <table className="w-full text-left border-collapse table-fixed">
        <thead className="bg-slate-50 border-b text-[8px] uppercase text-slate-400 font-black">
          <tr>
            <th className="px-2 py-1.5 w-10 text-center cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('no')}>
              <div className="flex items-center justify-center"># <SortIcon column="no" /></div>
            </th>
            <th className="px-1 py-1.5 w-10 text-center border-l cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('day')}>
              <div className="flex flex-col items-center"><Calendar size={10} /><SortIcon column="day" /></div>
            </th>
            <th className="px-1 py-1.5 w-10 text-center border-l"><Zap size={10} className="mx-auto" /></th>
            <th className="px-3 py-1.5 border-l cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('inf')}>
              <div className="flex items-center">NAME/INFO <SortIcon column="inf" /></div>
            </th>
            <th className="px-1 py-1.5 w-10 text-center text-red-500 border-l cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('red')}>
              <div className="flex flex-col items-center"><Skull size={10} /><SortIcon column="red" /></div>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {sortedPlayers.map((p) => (
            <tr key={p.no} className="align-top hover:bg-slate-50/50">
              <td className="px-2 py-2 text-center text-slate-300 font-mono text-[10px]">{p.no}</td>
              <td className="border-l border-slate-50"><input className="w-full text-center bg-transparent border-none p-2 text-xs font-mono focus:ring-0" value={p.day} onChange={(e) => updatePlayer(p.no, 'day', e.target.value)} /></td>
              <td className="border-l border-slate-50"><input className="w-full text-center bg-transparent border-none p-2 text-xs font-mono focus:ring-0" value={p.reason} onChange={(e) => updatePlayer(p.no, 'reason', e.target.value)} /></td>
              <td className="px-1 py-1 border-l border-slate-50"><textarea className="w-full bg-transparent border-none p-1 text-xs leading-tight resize-none min-h-[1.5rem] focus:ring-0" rows={1} value={p.inf} placeholder="..." onChange={(e) => updatePlayer(p.no, 'inf', e.target.value)} /></td>
              <td className="border-l border-slate-50"><input className="w-full text-center bg-transparent border-none p-2 text-xs font-black text-red-600 focus:ring-0" value={p.red} onChange={(e) => updatePlayer(p.no, 'red', e.target.value)} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PlayerGrid;
