import React from 'react';

export default function PTMBadge({ ptm }) {
  return (
    <div className="flex items-center gap-1 text-xs">
      <span>{ptm.emoji}</span>
      <span className="text-slate-300">{ptm.shortName}</span>
    </div>
  );
}