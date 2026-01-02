"use client";

import React from 'react';
import { 
  RefreshCcw,
  Edit,
  Download,
  Vote,
  Skull,
  X,
  Plus,
  Type
} from 'lucide-react';

interface FABProps {
  fabOpen: boolean;
  setFabOpen: (open: boolean) => void;
  setShowReset: (show: boolean) => void;
  setShowRoleUpdate: (show: boolean) => void;
  addNomination: () => void;
  addDeath: () => void;
  fontSize: 'small' | 'mid' | 'large';
  setFontSize: (size: 'small' | 'mid' | 'large') => void;
}

const FAB: React.FC<FABProps> = ({
  fabOpen,
  setFabOpen,
  setShowReset,
  setShowRoleUpdate,
  addNomination,
  addDeath,
  fontSize,
  setFontSize
}) => {
  return (
    <div className="fixed bottom-6 right-6 flex flex-col items-end gap-3 z-[10000]">
      {fabOpen && (
        <div className="flex flex-col gap-3 animate-in slide-in-from-bottom-5 fade-in duration-200">
          {/* Font Size Selector */}
          <div className="bg-white text-slate-900 border border-slate-200 px-2 py-2 rounded-full shadow-2xl flex items-center gap-1">
            <Type size={14} className="mx-2 text-slate-400" />
            {(['small', 'mid', 'large'] as const).map(size => (
              <button 
                key={size}
                onClick={() => setFontSize(size)}
                className={`px-3 py-1 rounded-full text-[8px] font-black uppercase transition-all ${fontSize === size ? 'bg-slate-900 text-white' : 'hover:bg-slate-100 text-slate-400'}`}
              >
                {size}
              </button>
            ))}
          </div>
          
          <button onClick={() => { setShowReset(true); setFabOpen(false); }} className="bg-white text-slate-900 border border-slate-200 px-4 py-3 rounded-full shadow-2xl flex items-center gap-2 text-[10px] font-black uppercase tracking-wider active:scale-90">
            <RefreshCcw size={14} className="text-red-500" /> Reset Ledger
          </button>
          <button onClick={() => { setShowRoleUpdate(true); setFabOpen(false); }} className="bg-white text-slate-900 border border-slate-200 px-4 py-3 rounded-full shadow-2xl flex items-center gap-2 text-[10px] font-black uppercase tracking-wider active:scale-90">
            <Edit size={14} className="text-blue-500" /> Role Update
          </button>
          <button className="bg-white text-slate-900 border border-slate-200 px-4 py-3 rounded-full shadow-2xl flex items-center gap-2 text-[10px] font-black uppercase tracking-wider active:scale-90">
            <Download size={14} className="text-blue-500" /> Export Data
          </button>
          <div className="h-px bg-slate-100 mx-4" />
          <button onClick={addNomination} className="bg-white text-slate-900 border border-slate-200 px-4 py-3 rounded-full shadow-2xl flex items-center gap-2 text-[10px] font-black uppercase tracking-wider active:scale-90">
            <Vote size={14} className="text-blue-500" /> New Nomination
          </button>
          <button onClick={addDeath} className="bg-white text-slate-900 border border-slate-200 px-4 py-3 rounded-full shadow-2xl flex items-center gap-2 text-[10px] font-black uppercase tracking-wider active:scale-90">
            <Skull size={14} className="text-red-500" /> Log Death
          </button>
        </div>
      )}
      <button onClick={() => setFabOpen(!fabOpen)} className={`w-14 h-14 rounded-full flex items-center justify-center shadow-[0_10px_40px_rgba(0,0,0,0.3)] transition-all active:scale-75 ${fabOpen ? 'bg-slate-900 text-white rotate-45' : 'bg-red-600 text-white'}`}>
        {fabOpen ? <X size={24} /> : <Plus size={24} />}
      </button>
    </div>
  );
};

export default FAB;