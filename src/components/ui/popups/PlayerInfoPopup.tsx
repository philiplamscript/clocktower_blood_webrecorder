"use client";

import React, { useState, useMemo } from 'react';
import { 
  X, 
  Calendar, 
  Skull, 
  Users, 
  Vote, 
  FileText, 
  Edit,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

import VoteHistoryClock from '../VoteHistoryClock';

interface PlayerInfoPopupProps {
  popupPlayerNo: number | null;
  setPopupPlayerNo: (no: number | null) => void;
  playerCount: number;
  players: any[];
  deadPlayers: number[];
  updatePlayerInfo: (no: number, text: string) => void;
  togglePlayerAlive: (no: number) => void;
  chars: any;
  nominations: any[];
  voteHistoryMode: 'vote' | 'beVoted';
  setVoteHistoryMode: (mode: 'vote' | 'beVoted') => void;
  setShowRoleSelector: (selector: { playerNo: number; roles: { role: string; category: string }[] } | null) => void;
  deaths: any[];
  setDeaths: React.Dispatch<React.SetStateAction<any[]>>;
}

const PlayerInfoPopup: React.FC<PlayerInfoPopupProps> = ({
  popupPlayerNo,
  setPopupPlayerNo,
  playerCount,
  players,
  deadPlayers,
  updatePlayerInfo,
  togglePlayerAlive,
  chars,
  nominations,
  voteHistoryMode,
  setVoteHistoryMode,
  setShowRoleSelector,
  deaths,
  setDeaths
}) => {
  const [editMode, setEditMode] = useState(false);
  const [tempInfo, setTempInfo] = useState('');

  const player = players.find(p => p.no === popupPlayerNo);
  const isDead = deadPlayers.includes(popupPlayerNo!);

  const playerDeaths = deaths.filter(d => parseInt(d.playerNo) === popupPlayerNo);
  const playerNominations = nominations.filter(n => 
    n.f === popupPlayerNo?.toString() || 
    n.t === popupPlayerNo?.toString() || 
    n.voters.split(',').includes(popupPlayerNo?.toString() || '')
  );

  const handleEditNomination = (nomination: any) => {
    // Placeholder for editing nomination - could open a modal or navigate
    console.log('Edit nomination:', nomination);
    // For now, just log; in future, implement edit functionality
  };

  if (!popupPlayerNo || !player) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[10000] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setPopupPlayerNo(popupPlayerNo > 1 ? popupPlayerNo - 1 : playerCount)} 
              className="text-slate-400 hover:text-slate-600"
            >
              <ChevronLeft size={16} />
            </button>
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black ${isDead ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                {popupPlayerNo}
              </div>
              <span className="text-lg font-bold text-slate-800">Player {popupPlayerNo}</span>
            </div>
            <button 
              onClick={() => setPopupPlayerNo(popupPlayerNo < playerCount ? popupPlayerNo + 1 : 1)} 
              className="text-slate-400 hover:text-slate-600"
            >
              <ChevronRight size={16} />
            </button>
          </div>
          <button onClick={() => setPopupPlayerNo(null)} className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Player Info */}
          <div className="bg-slate-50 rounded p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-slate-700">Player Info</span>
              <button onClick={() => setEditMode(!editMode)} className="text-blue-500 hover:text-blue-700">
                <Edit size={14} />
              </button>
            </div>
            {editMode ? (
              <textarea 
                value={tempInfo} 
                onChange={(e) => setTempInfo(e.target.value)} 
                onBlur={() => { updatePlayerInfo(popupPlayerNo, tempInfo); setEditMode(false); }}
                className="w-full border border-slate-300 rounded p-2 text-sm"
                rows={3}
              />
            ) : (
              <p className="text-sm text-slate-600">{player.inf || 'No info available'}</p>
            )}
          </div>

          {/* Status */}
          <div className="flex items-center justify-between bg-slate-50 rounded p-3">
            <span className="text-sm font-bold text-slate-700">Status</span>
            <button 
              onClick={() => togglePlayerAlive(popupPlayerNo)} 
              className={`px-3 py-1 rounded text-xs font-bold ${isDead ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}
            >
              {isDead ? 'Dead' : 'Alive'}
            </button>
          </div>

          {/* Vote History */}
          <div className="bg-white border rounded p-3">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold text-slate-700">Vote History</span>
              <div className="flex gap-2">
                <button 
                  onClick={() => setVoteHistoryMode('vote')} 
                  className={`px-2 py-1 rounded text-xs ${voteHistoryMode === 'vote' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600'}`}
                >
                  Voted
                </button>
                <button 
                  onClick={() => setVoteHistoryMode('beVoted')} 
                  className={`px-2 py-1 rounded text-xs ${voteHistoryMode === 'beVoted' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600'}`}
                >
                  Nominated
                </button>
              </div>
            </div>
            <VoteHistoryClock 
              playerNo={popupPlayerNo} 
              nominations={playerNominations} 
              onEditNomination={handleEditNomination} 
            />
          </div>

          {/* Deaths */}
          {playerDeaths.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded p-3">
              <span className="text-sm font-bold text-red-700 mb-2 block">Death Records</span>
              {playerDeaths.map((d, i) => (
                <div key={i} className="text-xs text-red-600 mb-1">
                  Day {d.day}: {d.reason} - {d.note}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayerInfoPopup;