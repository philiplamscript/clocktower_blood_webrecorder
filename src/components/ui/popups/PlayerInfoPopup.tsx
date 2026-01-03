"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { X, Skull, Megaphone, Target, Hand, Calendar, ArrowUpDown, ChevronUp, ChevronDown, Type, Edit } from 'lucide-react';
import VoteHistoryClock from '../VoteHistoryClock';
import RotaryPicker from '../../pickers/RotaryPicker/RotaryPicker'; // Import RotaryPicker

interface PlayerInfoPopupProps {
  popupPlayerNo: number | null;
  setPopupPlayerNo: React.Dispatch<React.SetStateAction<number | null>>;
  playerCount: number;
  players: any[];
  deadPlayers: number[];
  updatePlayerInfo: (no: number, text: string) => void;
  togglePlayerAlive: (no: number) => void;
  chars: any;
  nominations: any[];
  voteHistoryMode: 'vote' | 'beVoted';
  setVoteHistoryMode: React.Dispatch<React.SetStateAction<'vote' | 'beVoted'>>;
  setShowRoleSelector: React.Dispatch<React.SetStateAction<{ playerNo: number; roles: { role: string; category: string }[] } | null>>;
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
  setDeaths,
}) => {
  const player = useMemo(() => players.find(p => p.no === popupPlayerNo), [players, popupPlayerNo]);
  const isDead = player ? deadPlayers.includes(player.no) : false;
  const playerRoles = useMemo(() => {
    if (!player) return [];
    const roles: { role: string; category: string }[] = [];
    Object.entries(chars).forEach(([category, charList]: [string, any]) => {
      charList.forEach((char: any) => {
        if (char.note.includes(`P${player.no}`)) {
          roles.push({ role: char.name, category });
        }
      });
    });
    return roles;
  }, [player, chars]);

  const [selectedDayFilter, setSelectedDayFilter] = useState<number | 'all'>('all'); // New state for day filter

  // Effect to reset selectedDayFilter if currentDay changes or selected day becomes invalid
  useEffect(() => {
    if (popupPlayerNo !== null) {
      const currentMaxDay = nominations.reduce((max, nom) => Math.max(max, nom.day), 1);
      if (typeof selectedDayFilter === 'number' && selectedDayFilter > currentMaxDay) {
        setSelectedDayFilter('all');
      }
    }
  }, [nominations, popupPlayerNo, selectedDayFilter]);

  const dayOptions = useMemo(() => {
    const maxDay = nominations.reduce((max, nom) => Math.max(max, nom.day), 1);
    return ['All', ...Array.from({ length: maxDay }, (_, i) => i + 1)];
  }, [nominations]);

  const filteredNominations = useMemo(() => {
    if (selectedDayFilter === 'all') {
      return nominations;
    }
    return nominations.filter(nom => nom.day === selectedDayFilter);
  }, [nominations, selectedDayFilter]);

  if (!player || popupPlayerNo === null) return null;

  const handlePlayerInfoChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updatePlayerInfo(player.no, e.target.value);
    e.target.style.height = 'inherit';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const handleDeathReasonChange = (newReason: string) => {
    setDeaths(prev => prev.map(d => d.playerNo === player.no.toString() ? { ...d, reason: newReason } : d));
  };

  const handleDeathDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDeaths(prev => prev.map(d => d.playerNo === player.no.toString() ? { ...d, day: parseInt(e.target.value) || 1 } : d));
  };

  const currentDeath = deaths.find(d => parseInt(d.playerNo) === player.no);

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[10000] flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => setPopupPlayerNo(null)}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] flex flex-col animate-in zoom-in-95 slide-in-from-bottom-2 duration-200" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-3 border-b bg-slate-50 rounded-t-lg">
          <h2 className="text-lg font-bold text-slate-800">Player {player.no}</h2>
          <button onClick={() => setPopupPlayerNo(null)} className="text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>

        <div className="p-4 overflow-y-auto no-scrollbar flex-1">
          <div className="space-y-4">
            {/* Player Status & Info */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => togglePlayerAlive(player.no)}
                className={`flex-none w-10 h-10 rounded-full flex items-center justify-center text-sm font-black transition-all border-2 shadow-sm ${
                  isDead
                    ? 'bg-slate-900 text-slate-500 border-red-900/50 grayscale'
                    : 'bg-blue-600 text-white border-blue-400 hover:bg-blue-700'
                } active:scale-90`}
              >
                {isDead ? <Skull size={14} /> : player.no}
              </button>
              <div className="flex-1">
                <textarea
                  className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs leading-tight resize-none focus:ring-0 overflow-hidden min-h-[40px]"
                  rows={1}
                  value={player.inf}
                  placeholder="Player information / Role guess"
                  onChange={handlePlayerInfoChange}
                  onFocus={handlePlayerInfoChange}
                />
              </div>
            </div>

            {/* Death Info */}
            {isDead && currentDeath && (
              <div className="bg-red-50 border border-red-200 rounded p-3 flex items-center gap-3 text-red-700 text-xs">
                <Skull size={16} className="flex-none" />
                <div className="flex-1 flex items-center gap-2">
                  <span className="font-bold">Died Day:</span>
                  <input
                    type="number"
                    className="w-10 text-center bg-transparent border-b border-red-300 focus:ring-0 text-red-700 font-bold p-0"
                    value={currentDeath.day}
                    onChange={handleDeathDayChange}
                  />
                  <span className="font-bold">Reason:</span>
                  <select
                    className="bg-transparent border-b border-red-300 focus:ring-0 text-red-700 font-bold p-0"
                    value={currentDeath.reason}
                    onChange={(e) => handleDeathReasonChange(e.target.value)}
                  >
                    {['⚔️', '☀️', '🌑', '🌗', '🌕'].map(reason => (
                      <option key={reason} value={reason}>{reason}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Assigned Roles */}
            <div className="bg-slate-50 border border-slate-200 rounded p-3">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Assigned Roles</h3>
                <button
                  onClick={() => setShowRoleSelector({ playerNo: player.no, roles: playerRoles })}
                  className="text-blue-600 hover:text-blue-700 text-[9px] font-bold flex items-center gap-1"
                >
                  <Edit size={10} /> Edit
                </button>
              </div>
              {playerRoles.length > 0 ? (
                <ul className="space-y-1">
                  {playerRoles.map((role, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs">
                      <span className={`w-2 h-2 rounded-full ${role.category === 'Townsfolk' ? 'bg-blue-400' : role.category === 'Outsider' ? 'bg-blue-200' : role.category === 'Minion' ? 'bg-red-400' : 'bg-red-600'}`}></span>
                      <span className="font-medium">{role.role}</span>
                      <span className="text-slate-400 text-[10px]">({role.category})</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-400 text-xs italic">No roles assigned.</p>
              )}
            </div>

            {/* Vote History */}
            <div className="bg-slate-50 border border-slate-200 rounded p-3">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Vote History</h3>
                <div className="flex items-center gap-2">
                  {/* Day Filter RotaryPicker */}
                  <div className="w-16 h-6 bg-white rounded border border-slate-200">
                    <RotaryPicker
                      value={selectedDayFilter === 'all' ? 0 : selectedDayFilter as number}
                      min={0}
                      max={dayOptions.length - 1}
                      onChange={(val) => setSelectedDayFilter(val === 0 ? 'all' : val)}
                      color="text-slate-900"
                      options={dayOptions} // Pass options to RotaryPicker
                    />
                  </div>
                  <button
                    onClick={() => setVoteHistoryMode(voteHistoryMode === 'vote' ? 'beVoted' : 'vote')}
                    className="text-blue-600 hover:text-blue-700 text-[9px] font-bold flex items-center gap-1"
                  >
                    <ArrowUpDown size={10} /> {voteHistoryMode === 'vote' ? 'Voted By' : 'Nominated'}
                  </button>
                </div>
              </div>
              <VoteHistoryClock
                playerNo={player.no}
                nominations={filteredNominations} // Use filtered nominations
                mode={voteHistoryMode}
                playerCount={playerCount}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerInfoPopup;