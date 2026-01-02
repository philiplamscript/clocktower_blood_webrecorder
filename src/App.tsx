"use client";

import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { 
  Users, 
  Vote, 
  ShieldAlert, 
  FileText, 
  Plus, 
  Trash2, 
  Calendar,
  Zap,
  Skull, 
  RefreshCcw,
  AlertTriangle,
  Minus,
  Check,
  Megaphone,
  Target,
  Hand,
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
  X,
  Download,
  Scroll,
  Type,
  Edit
} from 'lucide-react';


import {
  type Player,
  type Nomination,
  type Death,
  type Character,
  type CharDict,
  type RoleDist,
  
  INITIAL_PLAYERS,
  REASON_CYCLE,
  STATUS_OPTIONS,
  createInitialChars,
} from './type'


import PlayerGrid from './Components/PlayerGrid/PlayerGrid';
import VoteLedger from './Components/VoteLedger/VoteLedger';
import DeathLedger from './Components/DeathLedger/DeathLedger';
import RotaryPicker from './Components/RotaryPicker/RotaryPicker';
import TextRotaryPicker from './Components/RotaryPicker/TextRotaryPicker';
import {ClockPicker} from './Components/ClockPicker/ClockPicker';

import PlayerInfoPopup from './components/Popups/PlayerInfoPopup';
import RoleSelectorPopup from './components/Popups/RoleSelectorPopup';
import RoleUpdatePopup from './components/Popups/RoleUpdatePopup';
import ResetConfirmation from './components/Popups/ResetConfirmation';
import FAB from './components/FAB';

export default function App() {
  // Persistence Helper
  const getStorage = (key: string, fallback: any) => {
    const saved = localStorage.getItem(`clocktower_${key}`);
    return saved ? JSON.parse(saved) : fallback;
  };

  const [activeTab, setActiveTab] = useState<'players' | 'votes' | 'deaths' | 'chars' | 'notes'>('players');
  const [currentDay, setCurrentDay] = useState(() => getStorage('day', 1));
  const [playerCount, setPlayerCount] = useState(() => getStorage('count', 15));
  const [players, setPlayers] = useState<Player[]>(() => getStorage('players', Array.from({ length: 15 }, (_, i) => ({ no: i + 1, inf: '', day: '', reason: '', red: '' }))));
  const [nominations, setNominations] = useState<Nomination[]>(() => getStorage('nominations', [{ id: '1', day: 1, f: '-', t: '-', voters: '', note: '' }]));
  const [deaths, setDeaths] = useState<Death[]>(() => getStorage('deaths', [
    { id: 'default-execution', day: 1, playerNo: '', reason: '⚔️', note: '', isConfirmed: true },
    { id: 'default-night', day: 1, playerNo: '', reason: '🌑', note: '', isConfirmed: true }
  ]));
  const [chars, setChars] = useState<CharDict>(() => getStorage('chars', createInitialChars()));
  const [roleDist, setRoleDist] = useState<RoleDist>(() => getStorage('dist', { townsfolk: 0, outsiders: 0, minions: 0, demons: 1 }));
  const [note, setNote] = useState(() => getStorage('note', ''));
  const [fontSize, setFontSize] = useState<'small' | 'mid' | 'large'>(() => getStorage('font', 'mid'));
  
  const [showReset, setShowReset] = useState(false);
  const [fabOpen, setFabOpen] = useState(false);
  const [popupPlayerNo, setPopupPlayerNo] = useState<number | null>(null);
  const [showRoleSelector, setShowRoleSelector] = useState<{ playerNo: number; roles: { role: string; category: string }[] } | null>(null);
  const [showRoleUpdate, setShowRoleUpdate] = useState(false);
  const [roleUpdateText, setRoleUpdateText] = useState('');
  const [voteHistoryMode, setVoteHistoryMode] = useState<'vote' | 'beVoted'>('vote');

  // Auto-Save Effect
  useEffect(() => {
    localStorage.setItem('clocktower_day', JSON.stringify(currentDay));
    localStorage.setItem('clocktower_count', JSON.stringify(playerCount));
    localStorage.setItem('clocktower_players', JSON.stringify(players));
    localStorage.setItem('clocktower_nominations', JSON.stringify(nominations));
    localStorage.setItem('clocktower_deaths', JSON.stringify(deaths));
    localStorage.setItem('clocktower_chars', JSON.stringify(chars));
    localStorage.setItem('clocktower_dist', JSON.stringify(roleDist));
    localStorage.setItem('clocktower_note', JSON.stringify(note));
    localStorage.setItem('clocktower_font', JSON.stringify(fontSize));
  }, [currentDay, playerCount, players, nominations, deaths, chars, roleDist, note, fontSize]);

  // Reload Warning
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  const fontSizeClass = {
    small: 'text-[10px]',
    mid: 'text-xs',
    large: 'text-sm'
  }[fontSize];

  useEffect(() => {
    setPlayers(prev => {
      if (prev.length === playerCount) return prev;
      if (prev.length < playerCount) {
        const extra = Array.from({ length: playerCount - prev.length }, (_, i) => ({
          no: prev.length + i + 1, inf: '', day: '', reason: '', red: ''
        }));
        return [...prev, ...extra];
      }
      return prev.slice(0, playerCount);
    });
  }, [playerCount]);

  // AUTO-SYNC DEATHS TO PLAYERS
  useEffect(() => {
    setPlayers(prev => prev.map(p => {
      const death = deaths.find(d => parseInt(d.playerNo) === p.no);
      if (death) {
        return { ...p, day: death.day.toString(), reason: death.reason };
      } else {
        // Clear day and reason if no death entry
        return { ...p, day: '', reason: '' };
      }
    }));
  }, [deaths]);

  const [isDragging, setIsDragging] = useState(false);
  const [dragAction, setDragAction] = useState<'add' | 'remove' | null>(null);
  const [lastDraggedPlayer, setLastDraggedPlayer] = useState<number | null>(null);

  const deadPlayers = useMemo(() => {
    return players.filter(p => p.day !== '' || p.red !== '').map(p => p.no);
  }, [players]);

  const reset = () => {
    setPlayers(Array.from({ length: playerCount }, (_, i) => ({ no: i + 1, inf: '', day: '', reason: '', red: '' })));
    setNominations([{ id: Math.random().toString(36), day: 1, f: '-', t: '-', voters: '', note: '' }]);
    setDeaths([
      { id: 'default-execution', day: 1, playerNo: '', reason: '⚔️', note: '', isConfirmed: true },
      { id: 'default-night', day: 1, playerNo: '', reason: '🌑', note: '', isConfirmed: true }
    ]);
    setCurrentDay(1);
    setChars(prev => ({
      Townsfolk: prev.Townsfolk.map(c => ({ ...c, status: '—', note: '' })),
      Outsider: prev.Outsider.map(c => ({ ...c, status: '—', note: '' })),
      Minion: prev.Minion.map(c => ({ ...c, status: '—', note: '' })),
      Demon: prev.Demon.map(c => ({ ...c, status: '—', note: '' })),
    }));
    setNote('');
    localStorage.clear();
    setShowReset(false);
  };

  const addNomination = () => {
    setNominations([...nominations, { id: Math.random().toString(), day: currentDay, f: '-', t: '-', voters: '', note: '' }]);
    setActiveTab('votes');
    setFabOpen(false);
  };

  const addDeath = () => {
    setDeaths([...deaths, { id: Math.random().toString(), day: currentDay, playerNo: '', reason: '🌑', note: '', isConfirmed: true }]);
    setActiveTab('deaths');
    setFabOpen(false);
  };

  const updatePlayerInfo = (no: number, text: string) => {
    setPlayers(prev => prev.map(p => p.no === no ? { ...p, inf: text } : p));
  };

  const togglePlayerAlive = (no: number) => {
    if (deadPlayers.includes(no)) {
      // Make alive: remove death entry
      setDeaths(deaths.filter(d => parseInt(d.playerNo) !== no));
    } else {
      // Make dead: add death entry
      setDeaths([...deaths, { id: Math.random().toString(), day: currentDay, playerNo: no.toString(), reason: '🌑', note: '', isConfirmed: true }]);
    }
  };

  const parseRoleUpdate = () => {
    const lines = roleUpdateText.split('\n').map(l => l.trim()).filter(l => l);
    const newChars: CharDict = {
      Townsfolk: [],
      Outsider: [],
      Minion: [],
      Demon: []
    };
    let currentCategory: keyof CharDict | null = null;
    lines.forEach(line => {
      if (line.includes('鎮民:')) currentCategory = 'Townsfolk';
      else if (line.includes('外來者:')) currentCategory = 'Outsider';
      else if (line.includes('爪牙:')) currentCategory = 'Minion';
      else if (line.includes('惡魔:')) currentCategory = 'Demon';
      else if (currentCategory && line) {
        newChars[currentCategory].push({ name: line, status: '—', note: '' });
      }
    });
    // Pad to 8
    Object.keys(newChars).forEach(cat => {
      while (newChars[cat as keyof CharDict].length < 8) {
        newChars[cat as keyof CharDict].push({ name: '', status: '—', note: '' });
      }
    });
    setChars(newChars);
    setShowRoleUpdate(false);
    setRoleUpdateText('');
  };

  const categoryColors = {
    Townsfolk: 'text-blue-400',
    Outsider: 'text-blue-200',
    Minion: 'text-red-400',
    Demon: 'text-red-600'
  };

  const categoryBg = {
    Townsfolk: 'bg-blue-100 hover:bg-blue-200',
    Outsider: 'bg-blue-50 hover:bg-blue-100',
    Minion: 'bg-orange-50 hover:bg-orange-100',
    Demon: 'bg-red-100 hover:bg-red-200'
  };

  return (
    <div className={`fixed inset-0 bg-slate-100 flex flex-col font-sans select-none ${fontSizeClass}`} onMouseUp={() => setIsDragging(false)}>
      
      <header className="flex-none bg-slate-900 text-white px-3 py-2 flex justify-between items-center shadow-md z-50">
        <div className="flex items-center gap-1.5"><ShieldAlert className="text-red-500" size={14} /><h1 className="font-black text-xs uppercase italic tracking-tighter">LEDGER PRO v3.7</h1></div>
        <div className="flex items-center gap-2">
          <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest">v3.7.2</div>
        </div>
      </header>

      {/* Wrapping Player Hub */}
      <div className="flex-none bg-slate-800 border-b border-slate-700 p-2 shadow-inner">
        <div className="flex flex-wrap items-center gap-1.5 max-w-4xl mx-auto">
          {/* Narrowed Day Controls */}
          <div className="flex items-center bg-slate-900 rounded-lg h-7 overflow-hidden border border-slate-700 shadow-lg mr-1 w-[58px]">
            <button onClick={() => setCurrentDay(Math.max(1, currentDay - 1))} className="flex-1 hover:bg-slate-800 text-slate-500 transition-colors flex items-center justify-center"><Minus size={10} /></button>
            <div className="w-6 font-black text-[9px] text-white bg-slate-800 h-full flex items-center justify-center tracking-tighter border-x border-slate-700">D{currentDay}</div>
            <button onClick={() => setCurrentDay(currentDay + 1)} className="flex-1 hover:bg-slate-800 text-slate-500 transition-colors flex items-center justify-center"><Plus size={10} /></button>
          </div>

          {/* Player Nodes */}
          {Array.from({ length: playerCount }, (_, i) => i + 1).map(num => {
            const isDead = deadPlayers.includes(num);
            const hasInfo = players.find(p => p.no === num)?.inf !== '';
            return (
              <button 
                key={num} 
                onClick={() => setPopupPlayerNo(num)}
                className={`flex-none w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black transition-all border-2 shadow-sm ${
                  isDead 
                    ? 'bg-slate-900 text-slate-500 border-red-900/50 grayscale' 
                    : hasInfo 
                      ? 'bg-blue-600 text-white border-blue-400' 
                      : 'bg-slate-700 text-slate-300 border-slate-600'
                } active:scale-90`}
              >
                {isDead ? <Skull size={10} /> : num}
              </button>
            );
          })}
        </div>
      </div>

      <nav className="flex-none bg-white border-b flex shadow-sm z-40">
        {[
          { id: 'players', icon: Users, label: 'PLAYERS' },
          { id: 'votes', icon: Vote, label: 'VOTES' },
          { id: 'deaths', icon: Skull, label: 'DEATHS' },
          { id: 'chars', icon: ShieldAlert, label: 'ROLES' },
          { id: 'notes', icon: FileText, label: 'NOTES' },
        ].map((t) => (
          <button key={t.id} onClick={() => setActiveTab(t.id as any)} className={`flex-1 py-2 flex flex-col items-center gap-0.5 border-b-2 transition-all ${activeTab === t.id ? 'border-red-600 bg-red-50 text-red-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>
            <t.icon size={12} /><span className="text-[8px] font-black">{t.label}</span>
          </button>
        ))}
      </nav>

      <main className="flex-1 overflow-y-auto p-3 no-scrollbar relative">
        <div className="max-w-4xl mx-auto space-y-3 pb-24">
          {(activeTab === 'votes' || activeTab === 'deaths') && (
            <div className="flex justify-end items-center gap-3">
              <button onClick={activeTab === 'votes' ? addNomination : addDeath} className={`${activeTab === 'votes' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-red-600 hover:bg-red-700'} text-white px-4 h-8 rounded text-[9px] font-black uppercase flex items-center gap-2 shadow-sm transition-all active:scale-95`}>
                <Plus size={12} /> {activeTab === 'votes' ? 'New Nomination' : 'Log Death'}
              </button>
            </div>
          )}

          {activeTab === 'players' && (
            <div id="player-grid-container">
              <PlayerGrid players={players} setPlayers={setPlayers} />
            </div>
          )}
          
          {activeTab === 'votes' && (
            <VoteLedger nominations={nominations} setNominations={setNominations} isDragging={isDragging} setIsDragging={setIsDragging} dragAction={dragAction} setDragAction={setDragAction} lastDraggedPlayer={lastDraggedPlayer} setLastDraggedPlayer={setLastDraggedPlayer} deadPlayers={deadPlayers} playerCount={playerCount} />
          )}

          {activeTab === 'deaths' && <DeathLedger deaths={deaths} setDeaths={setDeaths} deadPlayers={deadPlayers} playerCount={playerCount} />}
          
          {activeTab === 'chars' && (
            <<dyad-write path="src/App.tsx" description="Completing the refactoring of App.tsx by replacing the remaining popup and FAB sections with the extracted components.">
            <div className="space-y-4">
              <div className="bg-slate-900 rounded border border-slate-800 shadow-2xl overflow-hidden max-w-lg mx-auto">
                <div className="flex items-center gap-2 px-3 py-2 border-b border-slate-800 bg-slate-950">
                  <Scroll size={12} className="text-yellow-500" />
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Script & Player Distribution</span>
                </div>
                <div className="grid grid-cols-5 divide-x divide-slate-800">
                  <div className="flex flex-col items-center py-2 bg-slate-900/50">
                    <span className="text-[7px] font-black text-slate-500 mb-1">PLAYERS</span>
                    <RotaryPicker value={playerCount} min={1} max={20} onChange={setPlayerCount} color="text-yellow-500" />
                  </div>
                  {[
                    { key: 'townsfolk', label: 'TOWNS', color: 'text-blue-400' },
                    { key: 'outsiders', label: 'OUTS', color: 'text-blue-200' },
                    { key: 'minions', label: 'MINIONS', color: 'text-red-400' },
                    { key: 'demons', label: 'DEMON', color: 'text-red-600' }
                  ].map(d => (
                    <div key={d.key} className="flex flex-col items-center py-2">
                      <span className={`text-[7px] font-black ${d.color} mb-1`}>{d.label}</span>
                      <RotaryPicker 
                        value={roleDist[d.key as keyof RoleDist]} 
                        min={0} 
                        max={20} 
                        onChange={(val) => setRoleDist({ ...roleDist, [d.key]: val })} 
                        color={d.color}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                {(Object.entries(chars) as any).map(([f, list]: any) => (
                  <div key={f} className="space-y-1">
                    <h3 className="text-[9px] font-black text-slate-400 px-1 uppercase tracking-widest">{f}s</h3>
                    <div className="bg-white rounded border overflow-hidden">
                      {list.map((c: Character, i: number) => (
                        <div key={i} className="flex border-b last:border-0 h-8 items-center px-2 gap-2">
                          <input className="flex-1 bg-transparent border-none p-0 text-[10px] focus:ring-0 font-bold" placeholder="..." value={c.name} onChange={(e) => setChars({ ...chars, [f]: chars[f as keyof CharDict].map((item, idx) => idx === i ? { ...item, name: e.target.value } : item) })} />
                          <div className="w-12 bg-slate-50 rounded border-l border-slate-100 h-full">
                            <TextRotaryPicker 
                              value={c.status} 
                              options={STATUS_OPTIONS} 
                              onChange={(val) => setChars({ ...chars, [f]: chars[f as keyof CharDict].map((item, idx) => idx === i ? { ...item, status: val } : item) })}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="bg-white rounded border p-4 shadow-sm min-h-[400px]">
              <textarea className="w-full h-full border-none focus:ring-0 text-xs font-mono italic leading-relaxed min-h-[400px]" placeholder="Type social reads here..." value={note} onChange={(e) => setNote(e.target.value)} />
            </div>
          )}
        </div>
      </main>

      {/* Extracted Popups */}
      <PlayerInfoPopup
        popupPlayerNo={popupPlayerNo}
        setPopupPlayerNo={setPopupPlayerNo}
        playerCount={playerCount}
        players={players}
        deadPlayers={deadPlayers}
        updatePlayerInfo={updatePlayerInfo}
        togglePlayerAlive={togglePlayerAlive}
        chars={chars}
        nominations={nominations}
        voteHistoryMode={voteHistoryMode}
        setVoteHistoryMode={setVoteHistoryMode}
        setShowRoleSelector={setShowRoleSelector}
        deaths={deaths}
        setDeaths={setDeaths}
      />

      <RoleSelectorPopup
        showRoleSelector={showRoleSelector}
        setShowRoleSelector={setShowRoleSelector}
        updatePlayerInfo={updatePlayerInfo}
        players={players}
        categoryBg={categoryBg}
      />

      <RoleUpdatePopup
        showRoleUpdate={showRoleUpdate}
        setShowRoleUpdate={setShowRoleUpdate}
        roleUpdateText={roleUpdateText}
        setRoleUpdateText={setRoleUpdateText}
        parseRoleUpdate={parseRoleUpdate}
      />

      <ResetConfirmation
        showReset={showReset}
        setShowReset={setShowReset}
        reset={reset}
      />

      {/* Extracted FAB */}
      <FAB
        fabOpen={fabOpen}
        setFabOpen={setFabOpen}
        setShowReset={setShowReset}
        setShowRoleUpdate={setShowRoleUpdate}
        addNomination={addNomination}
        addDeath={addDeath}
        fontSize={fontSize}
        setFontSize={setFontSize}
      />

      <div className="bg-white border-t px-3 py-1 text-[9px] font-bold text-slate-400 flex justify-between items-center">
        <span>PLAYERS REGISTERED: {players.filter(p => p.inf).length} / {playerCount}</span>
        <div className="w-32 h-1 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-red-500" style={{ width: `${(players.filter(p => p.inf).length / playerCount) * 100}%` }} />
        </div>
      </div>
    </div>
  );
}