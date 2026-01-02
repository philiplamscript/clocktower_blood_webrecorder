import { Scroll } from 'lucide-react';
import RotaryPicker from '../RotaryPicker/RotaryPicker';
import { RoleDist } from '../../type';

const DistributionPanel = ({ 
  playerCount, 
  roleDist, 
  setPlayerCount, 
  setRoleDist 
}: { 
  playerCount: number, 
  roleDist: RoleDist, 
  setPlayerCount: (n: number) => void, 
  setRoleDist: (d: RoleDist) => void 
}) => {
  return (
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
              onChange={(val) => setRoleDist({ ...roleDist, [d.key as keyof RoleDist]: val })} 
              color={d.color}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DistributionPanel;