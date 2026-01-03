"use client";

import React, { useState, useMemo } from 'react';
import { Calendar, Vote } from 'lucide-react';
import TextRotaryPicker from '../pickers/RotaryPicker/TextRotaryPicker';
import { type Nomination } from '../../type';

interface VoteHistoryClockProps {
  nominations: Nomination[];
  playerNo: number;
  currentDay: number;
}

const VoteHistoryClock: React.FC<VoteHistoryClockProps> = ({ nominations, playerNo, currentDay }) => {
  const [selectedDay, setSelectedDay] = useState<string>('All');

  const dayOptions = useMemo(() => {
    const options = ['All'];
    for (let i = 1; i <= currentDay; i++) {
      options.push(i.toString());
    }
    return options;
  }, [currentDay]);

  const filteredNominations = useMemo(() => {
    if (selectedDay === 'All') return nominations;
    return nominations.filter(n => n.day === parseInt(selectedDay));
  }, [nominations, selectedDay]);

  const playerVotes = useMemo(() => {
    return filteredNominations.filter(n => {
      const voters = n.voters.split(',').filter(v => v !== '');
      return voters.includes(playerNo.toString()) || n.f === playerNo.toString() || n.t === playerNo.toString();
    });
  }, [filteredNominations, playerNo]);

  const handleDayChange = (newDay: string) => {
    if (newDay === dayOptions[dayOptions.length - 1] && selectedDay !== 'All') {
      // If at last day and changing, cycle back to 'All'
      setSelectedDay('All');
    } else {
      setSelectedDay(newDay);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Calendar size={12} className="text-slate-500" />
        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Vote History</span>
        <div className="ml-auto w-16">
          <TextRotaryPicker 
            value={selectedDay} 
            options={dayOptions} 
            onChange={handleDayChange} 
            color="text-red-500"
          />
        </div>
      </div>

      <div className="bg-slate-50 rounded border p-3 max-h-48 overflow-y-auto">
        {playerVotes.length === 0 ? (
          <div className="text-center text-slate-400 text-[10px] py-4">No votes recorded</div>
        ) : (
          <div className="space-y-2">
            {playerVotes.map((n) => {
              const voters = n.voters.split(',').filter(v => v !== '');
              const isVoter = voters.includes(playerNo.toString());
              const isFor = n.f === playerNo.toString();
              const isTarget = n.t === playerNo.toString();
              return (
                <div key={n.id} className="flex items-center gap-2 text-[9px] bg-white p-2 rounded shadow-sm">
                  <div className="font-mono text-slate-600">D{n.day}</div>
                  <div className="flex-1">
                    {isFor && <span className="text-blue-600 font-bold">FOR</span>}
                    {isTarget && <span className="text-emerald-600 font-bold ml-1">TARGET</span>}
                    {isVoter && <span className="text-red-600 font-bold ml-1">VOTED</span>}
                    {n.note && <span className="text-slate-500 ml-1">({n.note})</span>}
                  </div>
                  <div className="text-slate-400">{voters.length} votes</div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default VoteHistoryClock;