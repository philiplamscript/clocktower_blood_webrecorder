// --- TYPES & INTERFACES ---

interface Player {
  no: number;
  inf: string;
  day: string; 
  reason: string; 
  red: string;
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
  status: '0' | '1' | '2';
  note: string;
}

interface CharDict {
  Outsider: Character[];
  Minion: Character[];
  Demon: Character[];
}

interface SortConfig {
  key: keyof Player | null;
  direction: 'asc' | 'desc';
}

// --- CONSTANTS ---

const INITIAL_PLAYERS = 18;
const REASON_CYCLE = ['⚔️', '☀️', '🌑', '🌗', '🌕'];

const createInitialChars = (): CharDict => ({
  Outsider: Array(8).fill(null).map(() => ({ name: '', status: '0', note: '' })),
  Minion: Array(8).fill(null).map(() => ({ name: '', status: '0', note: '' })),
  Demon: Array(8).fill(null).map(() => ({ name: '', status: '0', note: '' })),
});

export {
  type Player,
  type Nomination,
  type Death,
  type Character,
  type CharDict,
  type SortConfig,
  
  INITIAL_PLAYERS,
  REASON_CYCLE,
  createInitialChars,
};