import { Skull, X } from 'lucide-react';

const PlayerInfoModal = ({ 
  playerNo, 
  isDead, 
  info, 
  onClose, 
  onUpdate 
}: { 
  playerNo: number, 
  isDead: boolean, 
  info: string, 
  onClose: () => void, 
  onUpdate: (text: string) => void 
}) => {
  return (
    <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-[2px]" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-2xl border border-slate-200 w-full max-w-[280px] overflow-hidden animate-in fade-in zoom-in-95 duration-150" onClick={e => e.stopPropagation()}>
        <div className={`px-3 py-2 flex justify-between items-center ${isDead ? 'bg-slate-900' : 'bg-blue-600'}`}>
          <div className="flex items-center gap-2">
            <span className="text-white font-black text-[10px] uppercase">Player {playerNo}</span>
            {isDead && <Skull size={10} className="text-red-500" />}
          </div>
          <button onClick={onClose} className="text-white/50 hover:text-white"><X size={14} /></button>
        </div>
        <div className="p-3">
          <textarea 
            autoFocus
            className="w-full min-h-[120px] border-none bg-slate-50 rounded p-2 text-xs focus:ring-1 focus:ring-blue-500/50 resize-none font-medium leading-relaxed"
            placeholder="Enter player info/role/reads..."
            value={info}
            onChange={(e) => onUpdate(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default PlayerInfoModal;