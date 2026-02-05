import React from 'react';

type FriendNoteProps = {
  author: string;
  message: string;
  emoji?: string;
};

export default function FriendNote({ author, message, emoji }: FriendNoteProps) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-4 transform hover:-rotate-1 transition-transform duration-200">
      <p className="text-slate-600 text-sm italic mb-2">"{message}"</p>
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
          - {author}
        </span>
        <span className="text-xl">{emoji}</span>
      </div>
    </div>
  );
}