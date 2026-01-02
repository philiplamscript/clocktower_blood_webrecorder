import TextRotaryPicker from '../RotaryPicker/TextRotaryPicker';
import { Character, CharDict, STATUS_OPTIONS } from '../../type';

const RoleList = ({ 
  type, 
  list, 
  onUpdate 
}: { 
  type: string, 
  list: Character[], 
  onUpdate: (idx: number, field: keyof Character, val: string) => void 
}) => {
  return (
    <div className="space-y-1">
      <h3 className="text-[9px] font-black text-slate-400 px-1 uppercase tracking-widest">{type}s</h3>
      <div className="bg-white rounded border overflow-hidden">
        {list.map((c, i) => (
          <div key={i} className="flex border-b last:border-0 h-8 items-center px-2 gap-2">
            <input 
              className="flex-1 bg-transparent border-none p-0 text-[10px] focus:ring-0 font-bold" 
              placeholder="..." 
              value={c.name} 
              onChange={(e) => onUpdate(i, 'name', e.target.value)} 
            />
            <div className="w-12 bg-slate-50 rounded border-l border-slate-100 h-full">
              <TextRotaryPicker 
                value={c.status} 
                options={STATUS_OPTIONS} 
                onChange={(val) => onUpdate(i, 'status', val)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoleList;