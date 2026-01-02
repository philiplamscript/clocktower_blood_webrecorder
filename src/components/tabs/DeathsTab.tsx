"use client";

import React from 'react';
import { Plus } from 'lucide-react';
import DeathLedger from '../ledger/DeathLedger/DeathLedger';

interface DeathsTabProps {
  deaths: any[];
  setDeaths: React.Dispatch<React.SetStateAction<any[]>>;
  deadPlayers: number[];
  playerCount: number;
  addDeath: () => void;
}

const DeathsTab: React.FC<DeathsTabProps> = ({ deaths, setDeaths, deadPlayers, playerCount, addDeath }) => {
  return (
    <>
      <div className="flex justify-end items-center gap-3">
        <button onClick={addDeath} className="bg-red-600 hover:bg-red-700 text-white px-4 h-8 rounded text-[9px] font-black uppercase flex items-center gap-2 shadow-sm transition-all active:scale-95">
          <Plus size={12} /> Log Death
        </button>
      </div>
      <DeathLedger deaths={deaths} setDeaths={setDeaths} deadPlayers={deadPlayers} playerCount={playerCount} />
    </>
  );
};

export default DeathsTab;