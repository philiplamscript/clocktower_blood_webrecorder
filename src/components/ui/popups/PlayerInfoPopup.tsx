"use client";

import React from 'react';
import { ChevronLeft, ChevronRight, Skull, Users, Vote, FileText, X } from 'lucide-react';
import { ClockPicker } from '../../pickers/ClockPicker/ClockPicker';
import VoteHistoryClock from '../VoteHistoryClock';

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
  setShowRoleSelector: (val: { playerNo: number; roles: { role: string; category: string }[] } | null) => void;
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
  if (!popupPlayerNo) return null;

  const player = players.find(p => p.no === popupPlayerNo);
  const isDead = deadPlayers.includes(popupPlayerNo);
  const death = deaths.find(d => parseInt(d.playerNo) === popupPlayerNo);
  const deathReason = death?.reason || '';

  const handlePrev = () => {
    setPopupPlayerNo(popupPlayerNo > 1 ? popupPlayerNo - 1 : playerCount);
  };

  const handleNext = () => {
    setPopupPlayerNo(popupPlayerNo < playerCount ? popupPlayerNo + 1 : 1);
  };

  const handlePlayerClick = (num: number) => {
    setPopupPlayerNo(num);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[10000] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header with Player Ribbon */}
        <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button onClick={handlePrev} className="text-slate-400 hover:text-white transition-colors">
              <ChevronLeft size={20} />
            </button>
            <div className="flex items-center gap-1">
              {/* Player Ribbon */}
              {Array.from({ length: playerCount }, (_, i) => i + 1).map(num => {
                const isCurrent = num === popupPlayerNo;
                const isDeadRibbon = deadPlayers.includes(num);
                const hasInfoRibbon = players.find(p => p.no === num)?.inf !== '';
                const hasPropertyRibbon = players.find(p => p.no === num)?.property !== '';
                const deathRibbon = deaths.find(d => parseInt(d.playerNo) === num);
                const deathReasonRibbon = deathRibbon?.reason || '';
                return (
                  <button 
                    key={num} 
                    onClick={() => handlePlayerClick(num)}
                    className={`flex-none w-7 h-7 rounded-full flex flex-col items-center justify-center text-[10px] font-black transition-all border-2 shadow-sm ${
                      isCurrent 
                        ? 'bg-red-600 text-white border-red-400 scale-110' 
                        : isDeadRibbon 
                          ? 'bg-slate-900 text-white border-red-900/50' 
                          : hasInfoRibbon 
                            ? 'bg-blue-600 text-white border-blue-400' 
                            : hasPropertyRibbon
                              ? 'bg-green-600 text-white border-green-400'
                              : 'bg-slate-700 text-slate-300 border-slate-600 hover:bg-slate-600'
                    } active:scale-90`}
                  >
                    <span>{num}</span>
                    {isDeadRibbon && <span className="text-[5px] leading-none opacity-75">{deathReasonRibbon}</span>}
                  </button>
                );
              })}
            </div>
            <button onClick={handleNext} className="text-slate-400 hover:text-white transition-colors">
              <ChevronRight size={20} />
            </button>
          </div>
          <button onClick={() => setPopupPlayerNo(null)} className="text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Player Info */}
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-black border-2 ${
              isDead ? 'bg-slate-900 text-white border-red-900/50' : 'bg-blue-600 text-white border-blue-400'
            }`}>
              {popupPlayerNo}
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-black text-slate-900">Player {popupPlayerNo}</h2>
              <p className="text-sm text-slate-600">
                {isDead ? `Dead on Day ${player?.day} (${deathReason})` : 'Alive'}
              </p>
            </div>
            <button 
              onClick={() => togglePlayerAlive(popupPlayerNo)} 
              className={`px-3 py-1 rounded text-xs font-black uppercase transition-colors ${
                isDead ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {isDead ? 'Revive' : 'Kill'}
            </button>
          </div>

          {/* Info Textarea */}
          <div>
            <label className="block text-sm font-black text-slate-700 mb-1">NOTES</label>
            <textarea 
              className="w-full h-32 border border-slate-300 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none" 
              placeholder="Add notes about this player..." 
              value={player?.inf || ''} 
              onChange={(e) => updatePlayerInfo(popupPlayerNo, e.target.value)}
            />
          </div>

          {/* Vote History */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Vote size={16} className="text-slate-600" />
              <span className="text-sm font-black text-slate-700 uppercase">Vote History</span>
              <div className="flex bg-slate-100 rounded p-1">
                <button 
                  onClick={() => setVoteHistoryMode('vote')} 
                  className={`px-2 py-1 text-xs font-black rounded transition-colors ${
                    voteHistoryMode === 'vote' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Voted
                </button>
                <button 
                  onClick={() => setVoteHistoryMode('beVoted')} 
                  className={`px-2 py-1 text-xs font-black rounded transition-colors ${
                    voteHistoryMode === 'beVoted' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Voted On
                </button>
              </div>
            </div>
            <VoteHistoryClock 
              playerNo={popupPlayerNo} 
              nominations={nominations} 
              mode={voteHistoryMode} 
              playerCount={playerCount}
            />
          </div>

          {/* Role Assignment */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Users size={16} className="text-slate-600" />
              <span className="text-sm font-black text-slate-700 uppercase">Role Assignment</span>
            </div>
            <button 
              onClick={() => {
                const roles = [];
                Object.entries(chars).forEach(([category, list]: [string, any]) => {
                  list.forEach((c: any) => {
                    if (c.name) roles.push({ role: c.name, category });
                  });
                });
                setShowRoleSelector({ playerNo: popupPlayerNo, roles });
              }}
              className="bg-slate-600 text-white px-3 py-2 rounded text-sm font-black hover:bg-slate-700 transition-colors"
            >
              Assign Role
            </button>
          </div>

          {/* Death Details (if dead) */}
          {isDead && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Skull size={16} className="text-red-600" />
                <span className="text-sm font-black text-slate-700 uppercase">Death Details</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-600 mb-1">DAY</label>
                  <input 
                    type="number" 
                    className="w-full border border-slate-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent" 
                    value={death?.day || ''} 
                    onChange={(e) => setDeaths(deaths.map(d => d.id === death.id ? { ...d, day: parseInt(e.target.value) || 1 } : d))} 
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-600 mb-1">REASON</label>
                  <ClockPicker 
                    playerCount={playerCount} 
                    label="D" 
                    value={death?.playerNo || ''} 
                    deadPlayers={deadPlayers} 
                    onChange={(val) => setDeaths(deaths.map(d => d.id === death.id ? { ...d, playerNo: val } : d))} 
                  />
                </div>
              </div>
              <div className="mt-2">
                <label className="block text-xs font-black text-slate-600 mb-1">NOTES</label>
                <textarea 
                  className="w-full h-20 border border-slate-300 rounded p-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none" 
                  placeholder="Death notes..." 
                  value={death?.note || ''} 
                  onChange={(e) => setDeaths(deaths.map(d => d.id === death.id ? { ...d, note: e.target.value } : d))} 
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayerInfoPopup;