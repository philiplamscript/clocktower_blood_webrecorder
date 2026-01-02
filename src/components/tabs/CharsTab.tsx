"use client";

import React from 'react';
import { Scroll } from 'lucide-react';
import RotaryPicker from '../pickers/RotaryPicker/RotaryPicker';
import TextRotaryPicker from '../pickers/RotaryPicker/TextRotaryPicker';
import { STATUS_OPTIONS, type Character, type CharDict, type RoleDist } from '../../type';

interface CharsTabProps {
  chars: CharDict;
  setChars: React.Dispatch<React.SetStateAction<CharDict>>;
  playerCount: number;
  setPlayerCount: React.Dispatch<React.SetStateAction<number>>;
  roleDist: RoleDist;
  setRoleDist: React.Dispatch<React.SetStateAction<RoleDist>>;
}

const CharsTab: React.FC<CharsTabProps> = ({ chars, setChars, playerCount, setPlayerCount, roleDist, setRoleDist }) => {
  return (
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
  );
};

export default CharsTab;