"use client";

import React from 'react';
import { X } from 'lucide-react';

interface RoleUpdatePopupProps {
  showRoleUpdate: boolean;
  setShowRoleUpdate: (show: boolean) => void;
  roleUpdateText: string;
  setRoleUpdateText: (text: string) => void;
  parseRoleUpdate: () => void;
}

const RoleUpdatePopup: React.FC<RoleUpdatePopupProps> = ({
  showRoleUpdate,
  setShowRoleUpdate,
  roleUpdateText,
  setRoleUpdateText,
  parseRoleUpdate
}) => {
  if (!showRoleUpdate) return null;

  return (
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
  );
};

export default RoleUpdatePopup;