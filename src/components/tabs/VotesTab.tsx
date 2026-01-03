"use client";

import React from 'react';
import { Plus } from 'lucide-react';
import VoteLedger from '../ledger/VoteLedger/VoteLedger';

interface VotesTabProps {
  nominations: any[];
  setNominations: React.Dispatch<React.SetStateAction<any[]>>;
  isDragging: boolean;
  setIsDragging: React.Dispatch<React.SetStateAction<boolean>>;
  dragAction: 'add' | 'remove' | null;
  setDragAction: React.Dispatch<React.SetStateAction<'add' | 'remove' | null>>;
  lastDraggedPlayer: number | null;
  setLastDraggedPlayer: React.Dispatch<React.SetStateAction<number | null>>;
  deadPlayers: number[];
  playerCount: number;
  addNomination: () => void;
}

const VotesTab: React.FC<VotesTabProps> = ({
  nominations,
  setNominations,
  isDragging,
  setIsDragging,
  dragAction,
  setDragAction,
  lastDraggedPlayer,
  setLastDraggedPlayer,
  deadPlayers,
  playerCount,
  addNomination
}) => {
  return (
    <>
      <div className="flex justify-end items-center gap-3">
        <button onClick={addNomination} className="bg-blue-600 hover:bg-blue-700 text-white px-4 h-8 rounded text-[9px] font-black uppercase flex items-center gap-2 shadow-sm transition-all active:scale-95">
          <Plus size={12} /> New Nomination
        </button>
      </div>
      <VoteLedger
        nominations={nominations}
        setNominations={setNominations}
        isDragging={isDragging}
        setIsDragging={setIsDragging}
        dragAction={dragAction}
        setDragAction={setDragAction}
        lastDraggedPlayer={lastDraggedPlayer}
        setLastDraggedPlayer={setLastDraggedPlayer}
        deadPlayers={deadPlayers}
        playerCount={playerCount}
      />
    </>
  );
};

export default VotesTab;