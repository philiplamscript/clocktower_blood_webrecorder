// --- TYPES & INTERFACES ---

interface Player {
  no: number;
  inf: string;
  day: string; 
  reason: string; 
  red: string;
  property: string; // New field for custom property assignments
}

interface Nomination {
  id: string;
  day: number;
  f: string;
  t: string;
  voters: string; 
  note: string;
}

interface Death {
  id: string;
  day: number;
  playerNo: string;
  reason: string;
  note: string;
  isConfirmed?: boolean;
}

interface Character {
  name: string;
  status: string; // "—" | "POSS" | "CONF" | "NOT"
  note: string;
}

interface CharDict {
  Townsfolk: Character[];
  Outsider: Character[];
  Minion: Character[];
  Demon: Character[];
}

interface RoleDist {
  townsfolk: number;
  outsiders: number;
  minions: number;
  demons: number;
}

interface SortConfig {
  key: keyof Player | null;
  direction: 'asc' | 'desc';
}

// --- CONSTANTS ---

const INITIAL_PLAYERS = 18;
const REASON_CYCLE = ['⚔️', '☀️', '🌑', '🌗', '🌕'];
const STATUS_OPTIONS = ["—", "POSS", "CONF", "NOT"];

const createInitialChars = (): CharDict => ({
  Townsfolk: Array(8).fill(null).map(() => ({ name: '', status: '—', note: '' })),
  Outsider: Array(8).fill(null).map(() => ({ name: '', status: '—', note: '' })),
  Minion: Array(8).fill(null).map(() => ({ name: '', status: '—', note: '' })),
  Demon: Array(8).fill(null).map(() => ({ name: '', status: '—', note: '' })),
});

export {
  type Player,
  type Nomination,
  type Death,
  type Character,
  type CharDict,
  type RoleDist,
  type SortConfig,
  
  INITIAL_PLAYERS,
  REASON_CYCLE,
  STATUS_OPTIONS,
  createInitialChars,
};