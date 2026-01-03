"use client";

import React from 'react';
import { X, User, Vote, Skull, Calendar, Target, Hand, FileText } from 'lucide-react';
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
  setShowRoleSelector: React.Dispatch<React.SetStateAction<any>>;
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

  const player = players.find((p: any) => p.no === popupPlayerNo);
  const isDead = deadPlayers.includes(popupPlayerNo);
  const death = deaths.find((d: any) => parseInt(d.playerNo) === popupPlayerNo);
  const deathReason = death?.reason || '';

  // Vote history logic
  const relevantNominations = nominations.filter((n: any) => {
    if (voteHistoryMode === 'vote') {
      return n.voters.split(',').includes(popupPlayerNo.toString());
    } else {
      return n.f === popupPlayerNo.toString() || n.t === popupPlayerNo.toString();
    }
  });

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full flex flex-col items-center justify-center text-lg font-black border-2 ${isDead ? 'bg-slate-900 text-white border-red-900/50' : 'bg-blue-600 text-white border-blue-400'}`}>
              <span>{popupPlayerNo}</span>
              {isDead && <span className="text-[8px] leading-none opacity-75">{deathReason}</span>}
            </div>
            <div>
              <h2 className="text-xl font-bold">Player {popupPlayerNo}</h2>
              <p className="text-slate-600">{isDead ? 'Dead' : 'Alive'}</p>
            </div>
          </div>
          <button onClick={() => setPopupPlayerNo(null)} className="text-slate-400 hover:text-slate-600">
            <X size={24} />
          </button>
        </div>
        <div className="p-4 space-y-4">
          {/* Player Info */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Player Info</label>
            <textarea
              value={player?.inf || ''}
              onChange={(e) => updatePlayerInfo(popupPlayerNo, e.target.value)}
              className="w-full border border-slate-300 rounded p-2"
              rows={3}
            />
          </textarea>
          </div>
          {/* Vote History */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Vote History</h3>
              <button onClick={() => setVoteHistoryMode(voteHistoryMode === 'vote' ? 'beVoted' : 'vote')} className="text-blue-600 hover:text-blue-800">
                {voteHistoryMode === 'vote' ? 'Show Nominations' : 'Show Votes'}
              </button>
            </div>
            {/* Player Ribbon */}
            <div className="flex flex-wrap gap-1 mb-4">
              {Array.from({ length: playerCount }, (_, i) => i + 1).map(num => {
                const isDead = deadPlayers.includes(num);
                const death = deaths.find((d: any) => parseInt(d.playerNo) === num);
                const deathReason = death?.reason || '';
                return (
                  <button
                    key={num}
                    onClick={() => {/* Select player for history or toggle mode */}}
                    className={`flex-none w-7 h-7 rounded-full flex flex-col items-center justify-center text-[10px] font-black transition-all border-2 shadow-sm ${
                      isDead
                        ? 'bg-slate-900 text-white border-red-900/50'
                        : 'bg-slate-700 text-slate-300 border-slate-600'
                    } active:scale-90`}
                  >
                    <span>{num}</span>
                    {isDead && <span className="text-[5px] leading-none opacity-75">{deathReason}</span>}
                  </button>
                );
              })}
            </div>
            <VoteHistoryClock
              playerNo={popupPlayerNo}
              nominations={relevantNominations}
              voteHistoryMode={voteHistoryMode}
              deadPlayers={deadPlayers}
              deaths={deaths}
              playerCount={playerCount}
            />
          </div>
          {/* Other sections can be added here */}
        </div>
      </div>
    </div>
  );
};

export default PlayerInfoPopup;