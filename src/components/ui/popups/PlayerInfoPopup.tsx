// File contents excluded from context, but assuming it has player buttons in a ribbon-like section
// I'll modify the player buttons to show death reason for dead players

// Assuming the component has something like:
const PlayerInfoPopup = ({ ... }) => {
  // ... existing code ...

  return (
    // ... existing JSX ...

    {/* Player buttons ribbon */}
    <div className="flex flex-wrap items-center gap-1.5">
      {Array.from({ length: playerCount }, (_, i) => i + 1).map(num => {
        const isDead = deadPlayers.includes(num);
        const death = deaths.find(d => parseInt(d.playerNo) === num);
        const deathReason = death?.reason || '';
        return (
          <button 
            key={num} 
            // ... existing onClick and classes ...
          >
            <span>{num}</span>
            {isDead && <span className="text-[5px] leading-none opacity-75">{deathReason}</span>}
          </button>
        );
      })}
    </div>

    // ... rest of component ...
  );
};

export default PlayerInfoPopup;