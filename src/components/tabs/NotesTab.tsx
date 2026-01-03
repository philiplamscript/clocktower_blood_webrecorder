"use client";

import React from 'react';

interface NotesTabProps {
  note: string;
  setNote: React.Dispatch<React.SetStateAction<string>>;
}

const NotesTab: React.FC<NotesTabProps> = ({ note, setNote }) => {
  return (
    <div className="bg-white rounded border p-4 shadow-sm min-h-[400px]">
      <textarea className="w-full h-full border-none focus:ring-0 text-xs font-mono italic leading-relaxed min-h-[400px]" placeholder="Type social reads here..." value={note} onChange={(e) => setNote(e.target.value)} />
    </div>
  );
};

export default NotesTab;