import React, { useState, useMemo, useEffect } from 'react';
import { 
  Users, 
  Vote, 
  ShieldAlert, 
  FileText, 
  Plus, 
  Skull, 
  RefreshCcw,
  Minus,
  X,
  Download,
  Type
} from 'lucide-react';

import {
  type Player,
  type Nomination,
  type Death,
  type Character,
  type CharDict,
  type RoleDist,
  STATUS_OPTIONS,
  createInitialChars,
} from './type'

import PlayerGrid from './Components/PlayerGrid/PlayerGrid';
import VoteLedger from './Components/VoteLedger/VoteLedger';
import DeathLedger from './Components/DeathLedger/DeathLedger';
import DistributionPanel from './Components/CharacterLedger/DistributionPanel';
import RoleList from './Components/CharacterLedger/RoleList';
import ResetModal from './Components/Modals/ResetModal';
import PlayerInfoModal from './Components/Modals/PlayerInfoModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<'players' | 'votes' | 'deaths' | 'chars' | 'notes'>('players');
  const [currentDay, setCurrentDay] = useState(1);
  const [playerCount, setPlayerCount] = useState(15);
  const [players, setPlayers] = useState<Player[]>(Array.from({ length: 15 }, (_, i) => ({ no: i + 1, inf: '', day: '', reason: '', red: '' })));
  const [nominations, setNominations] = useState<Nomination[]>([{ id: '1', day: 1, f: '-', t: '-', voters: '', note: '' }]);
  const [deaths, setDeaths] = useState<Death[]>([]);
  const [chars, setChars] = useState<CharDict>(createInitialChars());
  const [roleDist, setRoleDist] = useState<RoleDist>({ townsfolk: 0, outsiders: 0, minions: 0, demons: 1 });
  const [note, setNote] = useState('');
  const [showReset, setShowReset] = useState(false);
  const [fabOpen, setFabOpen] = useState(false);
  const [popupPlayerNo, setPopupPlayerNo] = useState<number | null>(null);
  const [fontSize, setFontSize] = useState<'small' | 'mid' | 'large'>('mid');

  const fontSizeClass = { small: 'text-[10px]', mid: 'text-xs', large: 'text-sm' }[fontSize];

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

  useEffect(() => {
    setPlayers(prev => prev.map(p => {
      const death = deaths.find(d => parseInt(d.playerNo) === p.no);
      return death ? { ...p, day: death.day.toString(), reason: death.reason } : p;
    }));
  }, [deaths]);

  const deadPlayers = useMemo(() => players.filter(p => p.day !== '' || p.red !== '').map(p => p.no), [players]);

  const reset = () => {
    setPlayers(Array.from({ length: playerCount }, (_, i) => ({ no: i + 1, inf: '', day: '', reason: '', red: '' })));
    setNominations([{ id: Math.random().toString(36), day: 1, f: '-', t: '-', voters: '', note: '' }]);
    setDeaths([]);
    setCurrentDay(1);
    setChars(createInitialChars());
    setNote('');
    setShowReset(false);
  };

  const updateRole = (type: keyof CharDict, idx: number, field: keyof Character, val: string) => {
    setChars({ ...chars, [type]: chars[type].map((item, i) => i === idx ? { ...item, [field]: val } : item) });
  };

  return (
    <div className={`fixed inset-0 bg-slate-100 flex flex-col font-sans select-none ${fontSizeClass}`}>
      <header className="flex-none bg-slate-900 text-white px-3 py-2 flex justify-between items-center shadow-md z-50">
        <div className="flex items-center gap-1.5"><ShieldAlert className="text-red-500" size={14} /><h1 className="font-black text-xs uppercase italic tracking-tighter">LEDGER PRO v3.7</h1></div>
        <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest">v3.7.2</div>
      </header>

      <div className="flex-none bg-slate-800 border-b border-slate-700 p-2 shadow-inner">
        <div className="flex flex-wrap items-center gap-1.5 max-w-4xl mx-auto">
          <div className="flex items-center bg-slate-900 rounded-lg h-7 overflow-hidden border border-slate-700 shadow-lg mr-1 w-[58px]">
            <button onClick={() => setCurrentDay(Math.max(1, currentDay - 1))} className="flex-1 hover:bg-slate-800 text-slate-500 flex items-center justify-center"><Minus size={10} /></button>
            <div className="w-6 font-black text-[9px] text-white bg-slate-800 h-full flex items-center justify-center border-x border-slate-700">D{currentDay}</div>
            <button onClick={() => setCurrentDay(currentDay + 1)} className="flex-1 hover:bg-slate-800 text-slate-500 flex items-center justify-center"><Plus size={10} /></button>
          </div>
          {Array.from({ length: playerCount }, (_, i) => i + 1).map(num => (
            <button key={num} onClick={() => setPopupPlayerNo(num)} className={`flex-none w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black transition-all border-2 shadow-sm ${deadPlayers.includes(num) ? 'bg-slate-900 text-slate-500 border-red-900/50' : players.find(p => p.no === num)?.inf ? 'bg-blue-600 text-white border-blue-400' : 'bg-slate-700 text-slate-300 border-slate-600'}`}>
              {deadPlayers.includes(num) ? <Skull size={10} /> : num}
            </button>
          ))}
        </div>
      </div>

      <nav className="flex-none bg-white border-b flex shadow-sm z-40">
        {[ { id: 'players', icon: Users, label: 'PLAYERS' }, { id: 'votes', icon: Vote, label: 'VOTES' }, { id: 'deaths', icon: Skull, label: 'DEATHS' }, { id: 'chars', icon: ShieldAlert, label: 'ROLES' }, { id: 'notes', icon: FileText, label: 'NOTES' } ].map((t) => (
          <button key={t.id} onClick={() => setActiveTab(t.id as any)} className={`flex-1 py-2 flex flex-col items-center gap-0.5 border-b-2 transition-all ${activeTab === t.id ? 'border-red-600 bg-red-50 text-red-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>
            <t.icon size={12} /><span className="text-[8px] font-black">{t.label}</span>
          </button>
        ))}
      </nav>

      <main className="flex-1 overflow-y-auto p-3 no-scrollbar">
        <div className="max-w-4xl mx-auto space-y-3 pb-24">
          {activeTab === 'players' && <PlayerGrid players={players} setPlayers={setPlayers} />}
          {activeTab === 'votes' && <VoteLedger nominations={nominations} setNominations={setNominations} deadPlayers={deadPlayers} playerCount={playerCount} />}
          {activeTab === 'deaths' && <DeathLedger deaths={deaths} setDeaths={setDeaths} deadPlayers={deadPlayers} playerCount={playerCount} />}
          {activeTab === 'chars' && (
            <div className="space-y-4">
              <DistributionPanel playerCount={playerCount} roleDist={roleDist} setPlayerCount={setPlayerCount} setRoleDist={setRoleDist} />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {(Object.keys(chars) as (keyof CharDict)[]).map(type => (
                  <RoleList key={type} type={type} list={chars[type]} onUpdate={(idx, field, val) => updateRole(type, idx, field, val)} />
                ))}
              </div>
            </div>
          )}
          {activeTab === 'notes' && <div className="bg-white rounded border p-4 min-h-[400px]"><textarea className="w-full h-full border-none focus:ring-0 text-xs font-mono italic min-h-[400px]" placeholder="Type reads here..." value={note} onChange={(e) => setNote(e.target.value)} /></div>}
        </div>
      </main>

      {popupPlayerNo !== null && <PlayerInfoModal playerNo={popupPlayerNo} isDead={deadPlayers.includes(popupPlayerNo)} info={players.find(p => p.no === popupPlayerNo)?.inf || ''} onClose={() => setPopupPlayerNo(null)} onUpdate={(text) => setPlayers(prev => prev.map(p => p.no === popupPlayerNo ? { ...p, inf: text } : p))} />}
      {showReset && <ResetModal onCancel={() => setShowReset(false)} onConfirm={reset} />}

      <div className="fixed bottom-6 right-6 flex flex-col items-end gap-3 z-[10000]">
        {fabOpen && (
          <div className="flex flex-col gap-3 animate-in slide-in-from-bottom-5 fade-in duration-200">
            <div className="bg-white border px-2 py-2 rounded-full shadow-2xl flex items-center gap-1">
              <Type size={14} className="mx-2 text-slate-400" />
              {(['small', 'mid', 'large'] as const).map(size => (
                <button key={size} onClick={() => setFontSize(size)} className={`px-3 py-1 rounded-full text-[8px] font-black uppercase transition-all ${fontSize === size ? 'bg-slate-900 text-white' : 'text-slate-400'}`}>{size}</button>
              ))}
            </div>
            <button onClick={() => { setShowReset(true); setFabOpen(false); }} className="bg-white border px-4 py-3 rounded-full shadow-2xl flex items-center gap-2 text-[10px] font-black uppercase"><RefreshCcw size={14} className="text-red-500" /> Reset</button>
            <button className="bg-white border px-4 py-3 rounded-full shadow-2xl flex items-center gap-2 text-[10px] font-black uppercase"><Download size={14} className="text-blue-500" /> Export</button>
            <button onClick={() => { setNominations([...nominations, { id: Math.random().toString(), day: currentDay, f: '-', t: '-', voters: '', note: '' }]); setActiveTab('votes'); setFabOpen(false); }} className="bg-white border px-4 py-3 rounded-full shadow-2xl flex items-center gap-2 text-[10px] font-black uppercase"><Plus size={14} className="text-blue-500" /> Nomination</button>
            <button onClick={() => { setDeaths([...deaths, { id: Math.random().toString(), day: currentDay, playerNo: '', reason: '🌑', note: '' }]); setActiveTab('deaths'); setFabOpen(false); }} className="bg-white border px-4 py-3 rounded-full shadow-2xl flex items-center gap-2 text-[10px] font-black uppercase"><Skull size={14} className="text-red-500" /> Death</button>
          </div>
        )}
        <button onClick={() => setFabOpen(!fabOpen)} className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all ${fabOpen ? 'bg-slate-900 text-white rotate-45' : 'bg-red-600 text-white'}`}>{fabOpen ? <X size={24} /> : <Plus size={24} />}</button>
      </div>
    </div>
  );
}