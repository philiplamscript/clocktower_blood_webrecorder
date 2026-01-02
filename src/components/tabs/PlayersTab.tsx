"use client";

import React from 'react';
import PlayerGrid from '../ledger/PlayerGrid/PlayerGrid';

interface PlayersTabProps {
  players: any[];
  setPlayers: React.Dispatch<React.SetStateAction<any[]>>;
}

const PlayersTab: React.FC<PlayersTabProps> = ({ players, setPlayers }) => {
  return (
    <div id="player-grid-container">
      <PlayerGrid players={players} setPlayers={setPlayers} />
    </div>
  );
};

export default PlayersTab;