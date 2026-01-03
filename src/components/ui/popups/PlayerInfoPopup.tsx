"use client";

import React from 'react';
import { 
  Skull,
  Vote,
  X
} from 'lucide-react';

import { REASON_CYCLE } from '../../../type';
import TextRotaryPicker from '../../pickers/RotaryPicker/TextRotaryPicker';
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
  setDeaths: (deaths: any[]) => void;
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
  if (popupPlayerNo === null) return null;

  return (
    <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-[2px]" onClick={() => setPopupPlayerNo(null)}>
      <div className="bg-white rounded-lg shadow-2xl border border-slate-200 w-full max-w-[400px] max-h-[80vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col" onClick={e => e.stopPropagation()}>
        {/* Player Ribbon */}
        <div className="flex-none bg-slate-800 border-b border-slate-700 p-2 shadow-inner">
          <div className="flex flex-wrap items-center gap-1 justify-center">
            {Array.from({ length: playerCount }, (_, i) => i + 1).map(num => {
              const isDead = deadPlayers.includes(num);
              const hasInfo = players.find(p => p.no === num)?.inf !== '';
              return (
                <button 
                  key={num} 
                  onClick={() => setPopupPlayerNo(num)}
                  className={`flex-none w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-black transition-all border shadow-sm ${
                    num === popupPlayerNo
                      ? 'bg-red-600 text-white border-red-400'
                      : isDead 
                        ? 'bg-slate-900 text-slate-500 border-red-900/50 grayscale' 
                        : hasInfo 
                          ? 'bg-blue-600 text-white border-blue-400' 
                          : 'bg-slate-700 text-slate-300 border-slate-600'
                  } active:scale-90`}
                >
                  {isDead ? <Skull size={8} /> : num}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {/* Status Toggle */}
          <div className="bg-slate-50 rounded border p-2">
            <div className="flex items-center gap-2 mb-2">
              <Skull size={12} className="text-red-500" />
              <span className="text-[9px] font-black text-slate-600 uppercase">Status</span>
            </div>
            <button 
              onClick={() => togglePlayerAlive(popupPlayerNo)}
              className={`w-full py-2 rounded text-[10px] font-black uppercase transition-colors ${deadPlayers.includes(popupPlayerNo) ? 'bg-red-600 text-white' : 'bg-green-600 text-white'}`}
            >
              {deadPlayers.includes(popupPlayerNo) ? 'DEAD' : 'ALIVE'}
            </button>
            {deadPlayers.includes(popupPlayerNo) && (
              <div className="mt-2 flex items-center gap-2">
                <span className="text-[10px] font-bold text-red-600">Day {players.find(p => p.no === popupPlayerNo)?.day}</span>
                <TextRotaryPicker 
                  value={players.find(p => p.no === popupPlayerNo)?.reason || ''} 
                  options={REASON_CYCLE} 
                  onChange={(val) => {
                    const death = deaths.find(d => parseInt(d.playerNo) === popupPlayerNo);
                    if (death) {
                      setDeaths(deaths.map(d => d.id === death.id ? { ...d, reason: val } : d));
                    }
                  }}
                  color="text-red-500"
                />
              </div>
            )}
          </div>

          {/* Player Notepad */}
          <textarea 
            autoFocus
            className="w-full min-h-[120px] border-none bg-slate-50 rounded p-2 text-xs focus:ring-1 focus:ring-blue-500/50 resize-none font-medium leading-relaxed"
            placeholder="Enter player info/role/reads..."
            value={players.find(p => p.no === popupPlayerNo)?.inf || ''}
            onChange={(e) => updatePlayerInfo(popupPlayerNo, e.target.value)}
          />

          {/* Role Selector */}
          <div className="flex gap-2">
            <button 
              onClick={() => {
                const allRoles = [
                  ...chars.Townsfolk.map(c => ({ role: c.name, category: 'Townsfolk' })).filter(item => item.role),
                  ...chars.Outsider.map(c => ({ role: c.name, category: 'Outsider' })).filter(item => item.role),
                  ...chars.Minion.map(c => ({ role: c.name, category: 'Minion' })).filter(item => item.role),
                  ...chars.Demon.map(c => ({ role: c.name, category: 'Demon' })).filter(item => item.role)
                ];
                setShowRoleSelector({ playerNo: popupPlayerNo, roles: allRoles });
              }}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-[10px] font-black uppercase transition-colors"
            >
              Keywords
            </button>
          </div>

          {/* Vote History */}
          <div className="bg-slate-50 rounded border p-2 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Vote size={12} className="text-blue-500" />
                <span className="text-[9px] font-black text-slate-600 uppercase">Vote History</span>
              </div>
              <button 
                onClick={() => setVoteHistoryMode(voteHistoryMode === 'vote' ? 'beVoted' : 'vote')}
                className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-2 py-1 rounded text-[8px] font-bold uppercase"
              >
                {voteHistoryMode === 'vote' ? 'Vote Count' : 'Be Voted Count'}
              </button>
            </div>
            <VoteHistoryClock 
              playerNo={popupPlayerNo} 
              nominations={nominations} 
              playerCount={playerCount} 
              deadPlayers={deadPlayers} 
              mode={voteHistoryMode} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerInfoPopup;