"use client";

import React from 'react';
import { X } from 'lucide-react';

interface RoleSelectorPopupProps {
  showRoleSelector: { playerNo: number; roles: { role: string; category: string }[] } | null;
  setShowRoleSelector: (selector: { playerNo: number; roles: { role: string; category: string }[] } | null) => void;
  updatePlayerInfo: (no: number, text: string) => void;
  players: any[];
  categoryBg: any;
}

const RoleSelectorPopup: React.FC<RoleSelectorPopupProps> = ({
  showRoleSelector,
  setShowRoleSelector,
  updatePlayerInfo,
  players,
  categoryBg
}) => {
  if (!showRoleSelector) return null;

  return (
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
  );
};

export default RoleSelectorPopup;