"use client";

import React, { useMemo } from 'react';
import { 
  X, 
  Skull, 
  Target, 
  Hand, 
  Edit3, 
  ChevronRight,
  Shield,
  Circle
} from 'lucide-react';
import { type Player, type Nomination, type Death, type CharDict } from '../../../type';

interface PlayerInfoPopupProps {
  popupPlayerNo: number | null;
  setPopupPlayerNo: (no: number | null) => void;
  playerCount: number;
  players: Player[];
  deadPlayers: number[];
  updatePlayerInfo: (no: number, text: string) => void;
  togglePlayerAlive: (no: number) => void;
  chars: CharDict;
  nominations: Nomination[];
  voteHistoryMode: 'vote' | 'beVoted';
  setVoteHistoryMode: (mode: 'vote' | 'beVoted') => void;
  setShowRoleSelector: (data: { playerNo: number; roles: { role: string; category: string }[] } | null) => void;
  deaths: Death[];
  setDeaths: React.Dispatch<React.SetStateAction<Death[]>>;
}

const PlayerInfoPopup: React.FC<PlayerInfoPopupProps> = ({
  popupPlayerNo,
  setPopupPlayerNo,
  players,
  deadPlayers,
  updatePlayerInfo,
  togglePlayerAlive,
  nominations,
  voteHistoryMode,
  setVoteHistoryMode,
  setShowRoleSelector,
  chars
}) => {
  if (popupPlayerNo === null) return null;

  const player = players.find(p => p.no === popupPlayerNo);
  if (!player) return null;

  const isDead = deadPlayers.includes(popupPlayerNo);
  const playerNoStr = popupPlayerNo.toString();

  const stats = useMemo(() => {
    const votesGiven = nominations.filter(n => n.voters.split(',').includes(playerNoStr)).length;
    const timesNominated = nominations.filter(n => n.f === playerNoStr).length;
    return { votesGiven, timesNominated };
  }, [nominations, playerNoStr]);

  const history = useMemo(() => {
    if (voteHistoryMode === 'vote') {
      return nominations.filter(n => n.voters.split(',').includes(playerNoStr));
    } else {
      return nominations.filter(n => n.f === playerNoStr);
    }
  }, [nominations, playerNoStr, voteHistoryMode]);

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className={`px-4 py-4 flex items-center justify-between border-b ${popupPlayerNo === 0 ? 'bg-amber-500' : isDead ? 'bg-slate-800' : 'bg-slate-900'} text-white`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-black border-2 ${popupPlayerNo === 0 ? 'bg-amber-600 border-amber-400' : isDead ? 'bg-slate-700 border-slate-600' : 'bg-blue-600 border-blue-400'}`}>
              {isDead ? <Skull size={18} /> : popupPlayerNo}
            </div>
            <div>
              <h2 className="font-black text-sm uppercase tracking-wider">{popupPlayerNo === 0 ? 'STORYTELLER' : `PLAYER #${popupPlayerNo}`}</h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase ${isDead ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                  {isDead ? 'ELIMINATED' : 'ALIVE'}
                </span>
                <span className="text-[8px] font-black text-white/40 uppercase">LEDGER ACCESS</span>
              </div>
            </div>
          </div>
          <button onClick={() => setPopupPlayerNo(null)} className="p-1.5 hover:bg-white/10 rounded-full transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Note Area */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between px-1">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Edit3 size={10} /> {popupPlayerNo === 0 ? "STORYTELLER LOG" : "PLAYER NOTEBOOK"}
              </label>
            </div>
            <textarea
              className="w-full h-24 bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none"
              placeholder="Record claims, info, or social reads here..."
              value={player.inf}
              onChange={(e) => updatePlayerInfo(popupPlayerNo, e.target.value)}
            />
          </div>

          {/* Action Stats / Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
              <div className="flex items-center gap-2 mb-1">
                <Hand size={12} className="text-blue-500" />
                <span className="text-[8px] font-black text-slate-500 uppercase">Votes Cast</span>
              </div>
              <div className="text-lg font-black text-slate-800">{stats.votesGiven}</div>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
              <div className="flex items-center gap-2 mb-1">
                <Target size={12} className="text-emerald-500" />
                <span className="text-[8px] font-black text-slate-500 uppercase">Nominated</span>
              </div>
              <div className="text-lg font-black text-slate-800">{stats.timesNominated}</div>
            </div>
          </div>

          {/* History / Toggle */}
          <div className="space-y-3">
            <div className="flex bg-slate-100 p-1 rounded-lg">
              <button 
                onClick={() => setVoteHistoryMode('vote')}
                className={`flex-1 py-1.5 rounded-md text-[9px] font-black transition-all ${voteHistoryMode === 'vote' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
              >
                VOTING HISTORY
              </button>
              <button 
                onClick={() => setVoteHistoryMode('beVoted')}
                className={`flex-1 py-1.5 rounded-md text-[9px] font-black transition-all ${voteHistoryMode === 'beVoted' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}
              >
                NOMINATION LOG
              </button>
            </div>

            <div className="bg-white border border-slate-100 rounded-xl max-h-32 overflow-y-auto divide-y divide-slate-50">
              {history.length > 0 ? history.map(h => (
                <div key={h.id} className="p-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black text-slate-400">D{h.day}</span>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-bold text-blue-500">#{h.f}</span>
                      <ChevronRight size={8} className="text-slate-300" />
                      <span className="text-[10px] font-bold text-emerald-500">#{h.t}</span>
                    </div>
                  </div>
                  <div className="text-[9px] font-bold text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded">
                    {h.voters.split(',').filter(v => v !== "").length} VOTES
                  </div>
                </div>
              )) : (
                <div className="p-8 text-center text-slate-300 italic text-[10px]">No history recorded</div>
              )}
            </div>
          </div>

          {/* Bottom Actions */}
          {popupPlayerNo !== 0 && (
            <div className="flex gap-2">
              <button 
                onClick={() => togglePlayerAlive(popupPlayerNo)}
                className={`flex-1 h-10 rounded-xl flex items-center justify-center gap-2 text-[10px] font-black uppercase transition-all ${isDead ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'}`}
              >
                <Skull size={14} /> {isDead ? 'Mark Alive' : 'Eliminate'}
              </button>
              <button 
                onClick={() => {
                  const roles: any[] = [];
                  Object.entries(chars).forEach(([category, list]) => {
                    list.filter(c => c.name).forEach(c => roles.push({ role: c.name, category }));
                  });
                  setShowRoleSelector({ playerNo: popupPlayerNo, roles });
                  setPopupPlayerNo(null);
                }}
                className="flex-1 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center gap-2 text-[10px] font-black uppercase hover:bg-slate-800 transition-all"
              >
                <Shield size={14} /> Assign Role
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayerInfoPopup;