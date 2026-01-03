// File contents excluded from context, but assuming it's a clock picker for vote history
// Modify to show dead players with death reason near the center

// Assuming the component has something like:
const VoteHistoryClock = ({ ... }) => {
  // ... existing code ...

  return (
    // ... existing JSX ...

    <svg ...>
      {players.map((num, i) => {
        const numStr = num.toString();
        const isDead = deadPlayers.includes(num);
        const death = deaths.find(d => parseInt(d.playerNo) === num);
        const deathReason = death?.reason || '';

        // ... existing path and text for slice ...

        return (
          <g key={num}>
            <path ... />
            <text ...>{num}</text>
            {isDead && (
              <text x={centerX} y={centerY + 10} textAnchor="middle" className="text-[8px] fill-red-500">
                {deathReason}
              </text>
            )}
          </g>
        );
      })}
    </svg>

    // ... rest of component ...
  );
};

export default VoteHistoryClock;