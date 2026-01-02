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

      {/* QUICK PLAYER INFO POPUP */}
      {popupPlayerNo !== null && (
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
                  Select Role
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
      )}

      <div className="fixed bottom-6 right-6 flex flex-col items-end gap-3 z-[10000]">
        {fabOpen && (
          <div className="flex flex-col gap-3 animate-in slide-in-from-bottom-5 fade-in duration-200">
            {/* Font Size Selector */}
            <div className="bg-white text-slate-900 border border-slate-200 px-2 py-2 rounded-full shadow-2xl flex items-center gap-1">
              <Type size={14} className="mx-2 text-slate-400" />
              {(['small', 'mid', 'large'] as const).map(size => (
                <button 
                  key={size}
                  onClick={() => setFontSize(size)}
                  className={`px-3 py-1 rounded-full text-[8px] font-black uppercase transition-all ${fontSize === size ? 'bg-slate-900 text-white' : 'hover:bg-slate-100 text-slate-400'}`}
                >
                  {size}
                </button>
              ))}
            </div>
            
            <button onClick={() => { setShowReset(true); setFabOpen(false); }} className="bg-white text-slate-900 border border-slate-200 px-4 py-3 rounded-full shadow-2xl flex items-center gap-2 text-[10px] font-black uppercase tracking-wider active:scale-90">
              <RefreshCcw size={14} className="text-red-500" /> Reset Ledger
            </button>
            <button onClick={() => { setShowRoleUpdate(true); setFabOpen(false); }} className="bg-white text-slate-900 border border-slate-200 px-4 py-3 rounded-full shadow-2xl flex items-center gap-2 text-[10px] font-black uppercase tracking-wider active:scale-90">
              <Edit size={14} className="text-blue-500" /> Role Update
            </button>
            <button className="bg-white text-slate-900 border border-slate-200 px-4 py-3 rounded-full shadow-2xl flex items-center gap-2 text-[10px] font-black uppercase tracking-wider active:scale-90">
              <Download size={14} className="text-blue-500" /> Export Data
            </button>
            <div className="h-px bg-slate-100 mx-4" />
            <button onClick={addNomination} className="bg-white text-slate-900 border border-slate-200 px-4 py-3 rounded-full shadow-2xl flex items-center gap-2 text-[10px] font-black uppercase tracking-wider active:scale-90">
              <Vote size={14} className="text-blue-500" /> New Nomination
            </button>
            <button onClick={addDeath} className="bg-white text-slate-900 border border-slate-200 px-4 py-3 rounded-full shadow-2xl flex items-center gap-2 text-[10px] font-black uppercase tracking-wider active:scale-90">
              <Skull size={14} className="text-red-500" /> Log Death
            </button>
          </div>
        )}
        <button onClick={() => setFabOpen(!fabOpen)} className={`w-14 h-14 rounded-full flex items-center justify-center shadow-[0_10px_40px_rgba(0,0,0,0.3)] transition-all active:scale-75 ${fabOpen ? 'bg-slate-900 text-white rotate-45' : 'bg-red-600 text-white'}`}>
          {fabOpen ? <X size={24} /> : <Plus size={24} />}
        </button>
      </div>

      <div className="bg-white border-t px-3 py-1 text-[9px] font-bold text-slate-400 flex justify-between items-center">
        <span>PLAYERS REGISTERED: {players.filter(p => p.inf).length} / {playerCount}</span>
        <div className="w-32 h-1 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-red-500" style={{ width: `${(players.filter(p => p.inf).length / playerCount) * 100}%` }} />
        </div>
      </div>

      {showReset && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded shadow-2xl p-6 max-w-xs text-center space-y-4">
            <AlertTriangle className="mx-auto text-red-600" size={32} />
            <h2 className="font-black uppercase tracking-tighter">Confirm Reset?</h2>
            <div className="flex gap-2">
              <button onClick={() => setShowReset(false)} className="flex-1 py-2 bg-slate-100 rounded text-[10px] font-bold">CANCEL</button>
              <button onClick={reset} className="flex-1 py-2 bg-red-600 text-white rounded text-[10px] font-black">RESET ALL</button>
            </div>
          </div>
        </div>
      )}

      {/* ROLE SELECTOR POPUP */}
      {showRoleSelector && (
        <div className="fixed inset-0 z-[10002] flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-[2px]" onClick={() => setShowRoleSelector(null)}>
          <div className="bg-white rounded-lg shadow-2xl border border-slate-200 w-full max-w-[400px] max-h-[400px] overflow-hidden animate-in fade-in zoom-in-95 duration-150" onClick={e => e.stopPropagation()}>
            <div className="px-3 py-2 bg-blue-600 flex justify-between items-center">
              <span className="text-white font-black text-[10px] uppercase">Select Role for Player {showRoleSelector.playerNo}</span>
              <button onClick={() => setShowRoleSelector(null)} className="text-white/50 hover:text-white"><X size={14} /></button>
            </div>
            <div className="p-3 max-h-[320px] overflow-y-auto">
              {showRoleSelector.roles.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1">
                    <h4 className="text-[8px] font-black text-blue-400 uppercase">Townsfolk</h4>
                    {showRoleSelector.roles.filter(r => r.category === 'Townsfolk').map((item, idx) => (
                      <button 
                        key={idx} 
                        onClick={() => {
                          updatePlayerInfo(showRoleSelector.playerNo, (players.find(p => p.no === showRoleSelector.playerNo)?.inf || '') + (players.find(p => p.no === showRoleSelector.playerNo)?.inf ? '\n' : '') + item.role);
                          setShowRoleSelector(null);
                        }}
                        className={`${categoryBg[item.category as keyof typeof categoryBg]} text-slate-900 px-2 py-1 rounded text-[9px] font-bold transition-colors text-left`}
                      >
                        {item.role}
                      </button>
                    ))}
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-[8px] font-black text-blue-200 uppercase">Outsider</h4>
                    {showRoleSelector.roles.filter(r => r.category === 'Outsider').map((item, idx) => (
                      <button 
                        key={idx} 
                        onClick={() => {
                          updatePlayerInfo(showRoleSelector.playerNo, (players.find(p => p.no === showRoleSelector.playerNo)?.inf || '') + (players.find(p => p.no === showRoleSelector.playerNo)?.inf ? '\n' : '') + item.role);
                          setShowRoleSelector(null);
                        }}
                        className={`${categoryBg[item.category as keyof typeof categoryBg]} text-slate-900 px-2 py-1 rounded text-[9px] font-bold transition-colors text-left`}
                      >
                        {item.role}
                      </button>
                    ))}
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-[8px] font-black text-red-400 uppercase">Minions & Demons</h4>
                    {showRoleSelector.roles.filter(r => r.category === 'Minion' || r.category === 'Demon').map((item, idx) => (
                      <button 
                        key={idx} 
                        onClick={() => {
                          updatePlayerInfo(showRoleSelector.playerNo, (players.find(p => p.no === showRoleSelector.playerNo)?.inf || '') + (players.find(p => p.no === showRoleSelector.playerNo)?.inf ? '\n' : '') + item.role);
                          setShowRoleSelector(null);
                        }}
                        className={`${categoryBg[item.category as keyof typeof categoryBg]} text-slate-900 px-2 py-1 rounded text-[9px] font-bold transition-colors text-left`}
                      >
                        {item.role}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-slate-500 text-xs">No roles defined yet.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ROLE UPDATE POPUP */}
      {showRoleUpdate && (
        <div className="fixed inset-0 z-[10003] flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-[2px]" onClick={() => setShowRoleUpdate(false)}>
          <div className="bg-white rounded-lg shadow-2xl border border-slate-200 w-full max-w-[500px] max-h-[80vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="px-3 py-2 bg-blue-600 flex justify-between items-center">
              <span className="text-white font-black text-[10px] uppercase">Role Update</span>
              <button onClick={() => setShowRoleUpdate(false)} className="text-white/50 hover:text-white"><X size={14} /></button>
            </div>
            <div className="flex-1 p-3 space-y-3">
              <textarea 
                className="w-full min-h-[300px] border border-slate-200 rounded p-2 text-xs font-mono resize-none"
                placeholder={`鎮民:
洗衣婦
圖書管理員
...

外來者:
管家
...

爪牙:
投毒者
...

惡魔:
小惡魔
...`}
                value={roleUpdateText}
                onChange={(e) => setRoleUpdateText(e.target.value)}
              />
              <button 
                onClick={parseRoleUpdate}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-[10px] font-black uppercase transition-colors"
              >
                Update Roles Table
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Custom Vote History Clock Component
const VoteHistoryClock = ({ playerNo, nominations, playerCount, deadPlayers, mode }: { playerNo: number, nominations: Nomination[], playerCount: number, deadPlayers: number[], mode: 'vote' | 'beVoted' }) => {
  const playerStr = playerNo.toString();
  const votedToCounts: { [key: string]: number } = {};
  const nominatedCounts: { [key: string]: number } = {};
  const nominatedByCounts: { [key: string]: number } = {};
  const nominatedArrows: { from: number, to: number }[] = [];
  const nominatedByArrows: { from: number, to: number }[] = [];

  nominations.forEach(n => {
    if (n.voters.includes(playerStr) && n.t && n.t !== '-') {
      votedToCounts[n.t] = (votedToCounts[n.t] || 0) + 1;
    }
    if (n.f === playerStr && n.t && n.t !== '-') {
      nominatedCounts[n.t] = (nominatedCounts[n.t] || 0) + 1;
      nominatedArrows.push({ from: playerNo, to: parseInt(n.t) });
    }
    if (n.t === playerStr && n.f && n.f !== '-') {
      nominatedByCounts[n.f] = (nominatedByCounts[n.f] || 0) + 1;
      nominatedByArrows.push({ from: parseInt(n.f), to: playerNo });
    }
  });

  const counts = mode === 'vote' ? votedToCounts : nominatedByCounts;
  const maxCount = Math.max(...Object.values(counts), 1);

  const players = Array.from({ length: playerCount }, (_, i) => i + 1);
  const cx = 144, cy = 144, outerRadius = 142, innerRadius = 50;

  const getSlicePath = (index: number, total: number) => {
    const angleStep = 360 / total;
    const startAngle = (index * angleStep) - 90;
    const endAngle = ((index + 1) * angleStep) - 90;
    const polarToCartesian = (angle: number, radius: number) => ({
      x: cx + (radius * Math.cos(angle * Math.PI / 180)),
      y: cy + (radius * Math.sin(angle * Math.PI / 180))
    });
    const p1 = polarToCartesian(startAngle, outerRadius);
    const p2 = polarToCartesian(endAngle, outerRadius);
    const p3 = polarToCartesian(endAngle, innerRadius);
    const p4 = polarToCartesian(startAngle, innerRadius);
    const largeArcFlag = angleStep > 180 ? 1 : 0;
    return `M ${p1.x} ${p1.y} A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${p2.x} ${p2.y} L ${p3.x} ${p3.y} A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${p4.x} ${p4.y} Z`;
  };

  const getPosition = (num: number) => {
    const index = num - 1;
    const angle = (index * (360 / playerCount)) - 90 + (360 / (playerCount * 2));
    const rad = 95;
    return {
      x: cx + rad * Math.cos(angle * Math.PI / 180),
      y: cy + rad * Math.sin(angle * Math.PI / 180)
    };
  };

  const drawArrow = (from: number, to: number, color: string) => {
    const fromPos = getPosition(from);
    const toPos = getPosition(to);
    const dx = toPos.x - fromPos.x;
    const dy = toPos.y - fromPos.y;
    const angle = Math.atan2(dy, dx);
    const headLength = 8;
    const headX = toPos.x - headLength * Math.cos(angle);
    const headY = toPos.y - headLength * Math.sin(angle);
    const leftX = headX - headLength * Math.cos(angle - Math.PI / 6);
    const leftY = headY - headLength * Math.sin(angle - Math.PI / 6);
    const rightX = headX - headLength * Math.cos(angle + Math.PI / 6);
    const rightY = headY - headLength * Math.sin(angle + Math.PI / 6);
    return (
      <g key={`${from}-${to}`}>
        <line x1={fromPos.x} y1={fromPos.y} x2={headX} y2={headY} stroke={color} strokeWidth="2" />
        <polygon points={`${headX},${headY} ${leftX},${leftY} ${rightX},${rightY}`} fill={color} />
      </g>
    );
  };

  return (
    <div className="w-full flex justify-center">
      <svg viewBox="0 0 288 288" className="w-32 h-32">
        {players.map((num, i) => {
          const numStr = num.toString();
          const intensity = counts[numStr] ? counts[numStr] / maxCount : 0;
          const isDead = deadPlayers.includes(num);
          const fill = isDead ? '#f8fafc' : intensity > 0 ? `rgba(239, 68, 68, ${intensity})` : '#ffffff';
          const stroke = '#f1f5f9';
          const path = getSlicePath(i, playerCount);
          const pos = getPosition(num);
          return (
            <g key={num}>
              <path d={path} fill={fill} stroke={stroke} strokeWidth="1" />
              <text x={pos.x} y={pos.y} textAnchor="middle" alignmentBaseline="middle" className={`text-[12px] font-black pointer-events-none ${intensity > 0 || isDead ? 'fill-white' : 'fill-slate-600'}`}>
                {num}
              </text>
            </g>
          );
        })}
        {/* Arrows for nominated */}
        {nominatedArrows.map(arrow => drawArrow(arrow.from, arrow.to, '#10b981'))}
        {/* Arrows for nominated by */}
        {nominatedByArrows.map(arrow => drawArrow(arrow.from, arrow.to, '#ef4444'))}
        <circle cx={cx} cy={cy} r="20" fill="#0f172a" />
        <text x={cx} y={cy - 5} textAnchor="middle" className="text-white text-[10px] font-black">{playerNo}</text>
        <text x={cx} y={cy + 5} textAnchor="middle" className="text-white text-[6px] font-black uppercase">{mode === 'vote' ? 'VOTE' : 'BE VOTED'}</text>
      </svg>
    </div>
  );
};