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
  X
} from 'lucide-react';


import {
  type Player,
  type Nomination,
  type Death,
  type Character,
  type CharDict,
  type SortConfig,
  
  INITIAL_PLAYERS,
  REASON_CYCLE,
  createInitialChars,
} from './type'


// --- TYPES & INTERFACES ---


import PlayerGrid from './Components/PlayerGrid/PlayerGrid';
import VoteLedger from './Components/VoteLedger/VoteLedger';
import DeathLedger from './Components/DeathLedger/DeathLedger';

// --- MAIN APP ---

export default function App() {
  const [activeTab, setActiveTab] = useState<'players' | 'votes' | 'deaths' | 'chars' | 'notes'>('players');
  const [currentDay, setCurrentDay] = useState(1);
  const [players, setPlayers] = useState<Player[]>(Array.from({ length: INITIAL_PLAYERS }, (_, i) => ({ no: i + 1, inf: '', day: '', reason: '', red: '' })));
  const [nominations, setNominations] = useState<Nomination[]>([{ id: '1', day: 1, f: '-', t: '-', voters: '', note: '' }]);
  const [deaths, setDeaths] = useState<Death[]>([]);
  const [chars, setChars] = useState<CharDict>(createInitialChars());
  const [note, setNote] = useState('');
  const [showReset, setShowReset] = useState(false);
  const [fabOpen, setFabOpen] = useState(false);

  // Global Drag State for Votes
  const [isDragging, setIsDragging] = useState(false);
  const [dragAction, setDragAction] = useState<'add' | 'remove' | null>(null);
  const [lastDraggedPlayer, setLastDraggedPlayer] = useState<number | null>(null);

  // Derive dead players for UI overlays
  const deadPlayers = useMemo(() => {
    return players.filter(p => p.day !== '' || p.red !== '').map(p => p.no);
  }, [players]);

  const reset = () => {
    setPlayers(Array.from({ length: INITIAL_PLAYERS }, (_, i) => ({ no: i + 1, inf: '', day: '', reason: '', red: '' })));
    setNominations([{ id: Math.random().toString(36), day: 1, f: '-', t: '-', voters: '', note: '' }]);
    setDeaths([]);
    setCurrentDay(1);
    setChars(prev => ({
      Outsider: prev.Outsider.map(c => ({ ...c, status: '0', note: '' })),
      Minion: prev.Minion.map(c => ({ ...c, status: '0', note: '' })),
      Demon: prev.Demon.map(c => ({ ...c, status: '0', note: '' })),
    }));
    setNote('');
    setShowReset(false);
  };

  const addNomination = () => {
    setNominations([...nominations, { id: Math.random().toString(), day: currentDay, f: '-', t: '-', voters: '', note: '' }]);
    setActiveTab('votes');
    setFabOpen(false);
  };

  const addDeath = () => {
    setDeaths([...deaths, { id: Math.random().toString(), day: currentDay, playerNo: '', reason: '🌑', note: '', isConfirmed: false }]);
    setActiveTab('deaths');
    setFabOpen(false);
  };

  return (
    <div className="fixed inset-0 bg-slate-100 flex flex-col font-sans text-xs select-none" onMouseUp={() => setIsDragging(false)}>
      
      <header className="flex-none bg-slate-900 text-white px-3 py-2 flex justify-between items-center shadow-md z-50">
        <div className="flex items-center gap-1.5"><ShieldAlert className="text-red-500" size={14} /><h1 className="font-black text-xs uppercase italic tracking-tighter">LEDGER PRO v3.7</h1></div>
        <div className="flex gap-2">
          <button onClick={() => setShowReset(true)} className="bg-slate-700 hover:bg-red-800 text-[8px] px-2 py-1 rounded font-black uppercase transition-colors">Reset</button>
          <button className="bg-red-600 hover:bg-red-700 px-4 py-1 rounded text-[9px] font-black shadow-lg transition-colors">EXPORT</button>
        </div>
      </header>

      {/* Quick-Tap Player Ribbon */}
      <div className="flex-none bg-slate-800 flex items-center overflow-x-auto no-scrollbar border-b border-slate-700 h-10 px-2 gap-2 shadow-inner">
        {Array.from({ length: 18 }, (_, i) => i + 1).map(num => {
          const isDead = deadPlayers.includes(num);
          const hasInfo = players.find(p => p.no === num)?.inf !== '';
          return (
            <button 
              key={num}
              onClick={() => {
                const target = document.querySelector(`#player-row-${num}`);
                if (target) target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                setActiveTab('players');
              }}
              className={`flex-none w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black transition-all border-2 ${
                isDead ? 'bg-slate-900 text-slate-500 border-red-900/50' : 
                hasInfo ? 'bg-blue-600 text-white border-blue-400' : 
                'bg-slate-700 text-slate-300 border-slate-600'
              } active:scale-90`}
            >
              {isDead ? <Skull size={10} /> : num}
            </button>
          );
        })}
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
            <t.icon size={12} />
            <span className="text-[8px] font-black">{t.label}</span>
          </button>
        ))}
      </nav>

      <main className="flex-1 overflow-y-auto p-3 no-scrollbar relative">
        <div className="max-w-4xl mx-auto space-y-3 pb-24">
          
          {(activeTab === 'votes' || activeTab === 'deaths') && (
            <div className="flex justify-between items-center gap-3">
              <div className="flex items-center bg-white border rounded shadow-sm h-8 overflow-hidden">
                <button onClick={() => setCurrentDay(Math.max(1, currentDay - 1))} className="px-3 hover:bg-slate-50 border-r"><Minus size={10} /></button>
                <div className="px-4 font-black text-[10px] uppercase">Day {currentDay}</div>
                <button onClick={() => setCurrentDay(currentDay + 1)} className="px-3 hover:bg-slate-50 border-l"><Plus size={10} /></button>
              </div>

              {activeTab === 'votes' && (
                <button onClick={addNomination} className="bg-blue-600 hover:bg-blue-700 text-white px-4 h-8 rounded text-[9px] font-black uppercase flex items-center gap-2 shadow-sm transition-all active:scale-95">
                  <Plus size={12} /> New Nomination
                </button>
              )}
              {activeTab === 'deaths' && (
                <button onClick={addDeath} className="bg-red-600 hover:bg-red-700 text-white px-4 h-8 rounded text-[9px] font-black uppercase flex items-center gap-2 shadow-sm transition-all active:scale-95">
                  <Plus size={12} /> Log Death
                </button>
              )}
            </div>
          )}

          {activeTab === 'players' && (
            <div id="player-grid-container">
              {players.map(p => <div key={p.no} id={`player-row-${p.no}`} className="scroll-mt-32" />)}
              <PlayerGrid players={players} setPlayers={setPlayers} />
            </div>
          )}
          
          {activeTab === 'votes' && (
            <VoteLedger 
              nominations={nominations} setNominations={setNominations}
              isDragging={isDragging} setIsDragging={setIsDragging}
              dragAction={dragAction} setDragAction={setDragAction}
              lastDraggedPlayer={lastDraggedPlayer} setLastDraggedPlayer={setLastDraggedPlayer}
              deadPlayers={deadPlayers}
            />
          )}

          {activeTab === 'deaths' && <DeathLedger deaths={deaths} setDeaths={setDeaths} setPlayers={setPlayers} deadPlayers={deadPlayers} />}
          
          {activeTab === 'chars' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {(Object.entries(chars) as any).map(([f, list]: any) => (
                <div key={f} className="space-y-1">
                  <h3 className="text-[9px] font-black text-slate-400 px-1 uppercase tracking-widest">{f}s</h3>
                  <div className="bg-white rounded border overflow-hidden">
                    {list.map((c: Character, i: number) => (
                      <div key={i} className="flex border-b last:border-0 h-8 items-center px-2 gap-2">
                        <input className="flex-1 bg-transparent border-none p-0 text-[10px] focus:ring-0 font-bold" placeholder="..." value={c.name} onChange={(e) => setChars({ ...chars, [f]: chars[f as keyof CharDict].map((item, idx) => idx === i ? { ...item, name: e.target.value } : item) })} />
                        <select className="w-8 bg-slate-50 rounded border-none p-0 text-[10px] text-center" value={c.status} onChange={(e) => setChars({ ...chars, [f]: chars[f as keyof CharDict].map((item, idx) => idx === i ? { ...item, status: e.target.value as any } : item) })}>
                          <option>0</option><option>1</option><option>2</option>
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="bg-white rounded border p-4 shadow-sm min-h-[400px]">
              <textarea className="w-full h-full border-none focus:ring-0 text-xs font-mono italic leading-relaxed min-h-[400px]" placeholder="Type social reads here..." value={note} onChange={(e) => setNote(e.target.value)} />
            </div>
          )}
        </div>
      </main>

      {/* Global Expandable Floating Action Button (FAB) */}
      <div className="fixed bottom-6 right-6 flex flex-col items-end gap-3 z-[10000]">
        {fabOpen && (
          <div className="flex flex-col gap-3 animate-in slide-in-from-bottom-5 fade-in duration-200">
            <button onClick={addNomination} className="bg-white text-slate-900 border border-slate-200 px-4 py-3 rounded-full shadow-2xl flex items-center gap-2 text-[10px] font-black uppercase tracking-wider active:scale-90">
              <Vote size={14} className="text-blue-500" /> New Nomination
            </button>
            <button onClick={addDeath} className="bg-white text-slate-900 border border-slate-200 px-4 py-3 rounded-full shadow-2xl flex items-center gap-2 text-[10px] font-black uppercase tracking-wider active:scale-90">
              <Skull size={14} className="text-red-500" /> Log Death
            </button>
          </div>
        )}
        <button 
          onClick={() => setFabOpen(!fabOpen)}
          className={`w-14 h-14 rounded-full flex items-center justify-center shadow-[0_10px_40px_rgba(0,0,0,0.3)] transition-all active:scale-75 ${fabOpen ? 'bg-slate-900 text-white rotate-45' : 'bg-red-600 text-white'}`}
        >
          {fabOpen ? <X size={24} /> : <Plus size={24} />}
        </button>
      </div>

      <div className="bg-white border-t px-3 py-1 text-[9px] font-bold text-slate-400 flex justify-between items-center">
        <span>PLAYERS REGISTERED: {players.filter(p => p.inf).length} / 18</span>
        <div className="w-32 h-1 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-red-500" style={{ width: `${(players.filter(p => p.inf).length / 18) * 100}%` }} />
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
    </div>
  );
}