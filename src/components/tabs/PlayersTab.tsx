"use client";

import React from 'react';
import PlayerGrid from '../ledger/PlayerGrid/PlayerGrid';
import { FileText } from 'lucide-react';

interface PlayersTabProps {
  players: any[];
  setPlayers: React.Dispatch<React.SetStateAction<any[]>>;
  note: string;
  setNote: React.Dispatch<React.SetStateAction<string>>;
}

const PlayersTab: React.FC<PlayersTabProps> = ({ players, setPlayers, note, setNote }) => {
  return (
    <div className="space-y-4">
      {/* Note Ribbon */}
      <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 px-3 py-1.5 border-b border-slate-100 bg-slate-50">
          <FileText size={12} className="text-amber-500" />
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Global Note / Notepad</span>
        </div>
        <textarea 
          className="w-full bg-transparent border-none focus:ring-0 text-[11px] font-mono italic p-3 leading-relaxed min-h-[80px] resize-none" 
          placeholder="Syncing with ledger below... Enter social reads or storyteller notes." 
          value={note} 
          onChange={(e) => setNote(e.target.value)} 
        />
      </div>

      <div id="player-grid-container">
        <PlayerGrid players={players} setPlayers={setPlayers} />
      </div>
    </div>
  );
};

export default PlayersTab;