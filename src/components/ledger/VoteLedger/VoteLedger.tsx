import React from 'react';
import { 
  Vote, 
  FileText, 
  Trash2, 
  Calendar,
  Zap,
  Megaphone,
  Target,
  Hand,
  X
} from 'lucide-react';

import {
  type Nomination,
} from '../../../type'

// --- COMPONENT 3: VOTE LEDGER ---

const VoteLedger = ({ 
  nominations, 
  setNominations,
  deadPlayers,
  playerCount = 15
}: any) => {

  return (
    <div className="bg-white rounded border shadow-sm overflow-x-auto">
      <table className="w-full border-collapse table-fixed min-w-[600px]">
        <thead>
          <tr className="bg-slate-100 border-b text-[8px] uppercase text-slate-500 font-black">
            <th className="w-6 py-2 border-r text-center">D</th>
            <th className="w-8 py-2 border-r text-center text-slate-400"><Megaphone size={12} className="mx-auto" /></th>
            <th className="w-8 py-2 border-r text-center text-slate-400"><Target size={12} className="mx-auto" /></th>
            <th className="w-10 py-2 border-r text-center text-slate-400"><Hand size={12} className="mx-auto" /></th>
            <th className="w-8 py-2 border-r text-center">VCT</th>
            <th className="py-2 px-3 text-left">NOTES</th>
            <th className="w-6 py-2"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 font-mono">
          {nominations.map((n: Nomination) => (
            <tr key={n.id} className="h-10">
              <td className="p-0 border-r border-slate-100"><input type="number" className="w-full text-center border-none bg-transparent focus:ring-0 text-[10px] p-0 font-bold" value={n.day} onChange={(e) => setNominations(nominations.map((item: any) => item.id === n.id ? { ...item, day: parseInt(e.target.value) || 1 } : item))} /></td>
              
              <td className="p-0 border-r border-slate-100"><input type="text" className="w-full text-center border-none bg-transparent focus:ring-0 text-[10px] p-0 font-bold" value={n.f} onChange={(e) => setNominations(nominations.map((item: any) => item.id === n.id ? { ...item, f: e.target.value } : item))} /></td>
              <td className="p-0 border-r border-slate-100"><input type="text" className="w-full text-center border-none bg-transparent focus:ring-0 text-[10px] p-0 font-bold" value={n.t} onChange={(e) => setNominations(nominations.map((item: any) => item.id === n.id ? { ...item, t: e.target.value } : item))} /></td>
              
              <td className="p-0 border-r border-slate-100"><input type="text" className="w-full text-center border-none bg-transparent focus:ring-0 text-[10px] p-0 font-bold" value={n.voters} onChange={(e) => setNominations(nominations.map((item: any) => item.id === n.id ? { ...item, voters: e.target.value } : item))} /></td>
              <td className="p-0 border-r border-slate-100 text-center text-[10px] font-black">{n.voters.split(',').filter(v => v !== "").length}</td>
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